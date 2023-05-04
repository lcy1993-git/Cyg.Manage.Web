import { extend, RequestOptionsInit } from 'umi-request'
import { uploadAuditLog } from '@/utils/utils'

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
  let c_token = localStorage.getItem('Authorization')
  // let accessUrl = options.method === 'get' ? '/commonGet' : '/commonPost' //穿透接口
  // let handleUrl = url.includes('bbgl') ? url.slice(23) : url
  // let targetUrl = encodeURIComponent(`https://srthkf1.gczhyun.com:21530${handleUrl}`) //目标接口转码

  // let targetPort = getServiceIP(url)

  // let targetUrl = encodeURIComponent(url.includes('bbgl') ? url : `http://172.2.48.22${url}`) //目标接口转码
  // let isJson = url.includes('/json')
  // let isBbgl = url.includes('bbgl')
  // let isNoGlzz = isJson || isBbgl

  const { headers } = options
  if (c_token) {
    return {
      // url: isJson ? url : `http://11.188.130.19:31840${accessUrl}?target_url=${targetUrl}`,
      url: url,
      options: {
        ...options,
        headers: {
          ...headers,
          Authorization: c_token,
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'x-requested-with',
          'X-Content-Type-Options': 'nosniff',
        },
      },
    }
  }

  return {
    url: url,
    // url: isJson ? url : `http://11.188.130.19:31840${accessUrl}?target_url=${targetUrl}`,
    options: {
      ...options,
      headers: {
        ...headers,
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

export default request
