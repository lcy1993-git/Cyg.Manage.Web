import { extend, RequestOptionsInit } from 'umi-request'
// import { getServiceIP } from './utils'

const request = extend({})

// request拦截器, 改变url 或 options.
// @ts-ignore
request.interceptors.request.use(async (url: string, options: RequestOptionsInit) => {
  // let host = window.location.host
  let c_token = localStorage.getItem('Authorization')
  let accessUrl = options.method === 'get' ? '/commonGet' : '/commonPost' //穿透接口

  // let targetUrl = encodeURIComponent(`${protocol}//${host}${handleUrl}`) //目标接口转码
  // let handleUrl = url.includes('bbgl') ? url.slice(23) : url
  // let targetPort = getServiceIP(url)
  // console.log(url)

  let targetUrl = encodeURIComponent(url.includes('bbgl') ? url : `http://172.2.48.22${url}`) //目标接口转码
  let isJson = url.includes('/json')

  const { headers } = options
  if (c_token) {
    return {
      url: isJson ? url : `http://11.188.130.19:31840${accessUrl}?target_url=${targetUrl}`,
      // url: url,
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
    // url: url,
    url: isJson ? url : `http://11.188.130.19:31840${accessUrl}?target_url=${targetUrl}`,
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
