import { handleGetUrl, handlePostData, uploadAuditLog } from '@/utils/utils'
import { extend, RequestOptionsInit } from 'umi-request'

const request = extend({
  timeout: 1000 * 60 * 3,
  errorHandler: function (error) {
    /* 异常处理 */
    if (error?.type === 'Timeout') {
      uploadAuditLog([
        {
          auditType: 1,
          eventType: 6,
          eventDetailType: '连接超时',
          // executionResult: '连接超时',
          auditLevel: 4,
          serviceAdress: error?.request?.url,
        },
      ])
    }
  },
})

// request拦截器, 改变url 或 options.
// @ts-ignore
request.interceptors.request.use(async (url: string, options: RequestOptionsInit) => {
  const { headers, params } = options
  const requestHost = localStorage.getItem('requestHost')
  const c_token = localStorage.getItem('Authorization')
  // let isTrans = localStorage.getItem('isTransfer')
  const currentHost =
    requestHost && requestHost !== 'undefined' ? requestHost : 'http://localhost:8000/api'
  // const reqid = uuid.v1()
  // const timeStamp = Date.parse(`${new Date()}`)
  const handleUrl: string = url

  const accessUrl = options.method === 'get' ? '/commonGet' : '/commonPost' //穿透接口

  const isPlain = url.includes('/json') || url.includes('bbgl')

  const isUpload = options.requestType === 'form'

  const cheaders = isUpload ? headers : { ...headers, 'Content-Type': 'application/json' }

  console.log(options, 'kankan122222')
  if (c_token) {
    return {
      url: isPlain ? url : `${currentHost}${accessUrl}${handleGetUrl(params, handleUrl)}`,
      options: {
        ...options,
        data: isPlain || isUpload ? options.data : handlePostData(options.data),
        params: {},
        headers: {
          ...cheaders,
          Authorization: c_token,
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'x-requested-with',
          'X-Content-Type-Options': 'nosniff',
        },
      },
    }
  }

  return {
    url: isPlain ? url : `${currentHost}${accessUrl}${handleGetUrl(params, handleUrl)}`,
    options: {
      ...options,
      data: isPlain || isUpload ? options.data : handlePostData(options.data),
      params: {},
      headers: {
        ...cheaders,
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'x-requested-with',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  }
})

// response拦截器, 处理response
request.interceptors.response.use((response) => {
  let token = response.headers.get('Authorization')
  if (token) {
    localStorage.setItem('Authorization', token)
  }
  if (response.status === 408) {
    uploadAuditLog([
      {
        auditType: 1,
        eventType: 6,
        eventDetailType: '连接超时',
        // executionResult: '连接超时',
        auditLevel: 4,
        serviceAdress: response.url,
      },
    ])
  }
  return response
})
// 隔离装置上传文件把其他参数拼在url上
export const transformUrlParams = (url: string, data: object) => {
  let newUrl = url + ''
  Object.keys(data).forEach((key) => {
    if (newUrl.indexOf('?') !== -1) {
      newUrl += `&${key}=${data[key]}`
    } else {
      newUrl += `?${key}=${data[key]}`
    }
  })
  return newUrl
}

export default request
