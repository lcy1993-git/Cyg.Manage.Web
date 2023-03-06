import { extend, RequestOptionsInit } from 'umi-request'

const request = extend({})

// request拦截器, 改变url 或 options.
// @ts-ignore
request.interceptors.request.use(async (url: string, options: RequestOptionsInit) => {
  let host = window.location.host
  let c_token = localStorage.getItem('Authorization')
  let protocol = window.location.protocol
  let accessUrl = options.method === 'get' ? '/commonGet' : '/commonPost' //穿透接口

  let handleUrl = url.slice(4)
  // let targetUrl = encodeURIComponent(`${protocol}//${host}${handleUrl}`) //目标接口转码
  let targetUrl = encodeURIComponent(`https://srthkf2.gczhyun.com:21530${handleUrl}`) //目标接口转码
  let isBbgl = url.includes('bbgl.gczhyun.com') //是否为版本管理地址
  let isJson = url.includes('/json')

  const { headers } = options
  if (c_token) {
    return {
      url: isBbgl || isJson ? url : `http://10.6.211.96:8080${accessUrl}?target_url=${targetUrl}`,
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
    url: isBbgl || isJson ? url : `http://10.6.211.96:8080${accessUrl}?target_url=${targetUrl}`,
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
