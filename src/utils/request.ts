import { extend, RequestOptionsInit } from 'umi-request'

const request = extend({})

// request拦截器, 改变url 或 options.
// @ts-ignore
request.interceptors.request.use(async (url: string, options: RequestOptionsInit) => {
  let host = window.location.host
  let c_token = localStorage.getItem('Authorization')
  let accessUrl = options.method === 'get' ? '/commonGet' : '/commonPost' //穿透接口
  let targetUrl = encodeURIComponent(`${host}${url}`) //目标接口转码

  const { headers } = options
  if (c_token) {
    return {
      // url: `${accessUrl}?targetUrl=${targetUrl}`,
      url: url,
      options: {
        ...options,
        headers: {
          ...headers,
          Authorization: c_token,
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'x-requested-with',
        },
      },
    }
  }

  return {
    url: url,
    // url: `${accessUrl}?targetUrl=${targetUrl}`,
    options: {
      ...options,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'x-requested-with',
      },
    },
  }
})

// response拦截器, 处理response
request.interceptors.response.use((response, options) => {
  let token = response.headers.get('Authorization')
  if (token) {
    localStorage.setItem('Authorization', token)
  }
  return response
})

export default request
