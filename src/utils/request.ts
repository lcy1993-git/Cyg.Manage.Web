import { extend, RequestOptionsInit } from 'umi-request'
// import { getServiceIP } from './utils'

const request = extend({})

// request拦截器, 改变url 或 options.
// @ts-ignore
request.interceptors.request.use(async (url: string, options: RequestOptionsInit) => {
  let host = window.location.host
  let c_token = localStorage.getItem('Authorization')
  let accessUrl = options.method === 'get' ? '/commonGet' : '/commonPost' //穿透接口
  let handleUrl = url.includes('bbgl') ? url.slice(23) : url
  // let targetUrl = encodeURIComponent(`https://srthkf1.gczhyun.com:21530${handleUrl}`) //目标接口转码

  // let targetPort = getServiceIP(url)

  let targetUrl = encodeURIComponent(url.includes('bbgl') ? url : `http://172.2.48.22${url}`) //目标接口转码
  let isJson = url.includes('/json')
  let isBbgl = url.includes('bbgl')
  let isNoGlzz = isJson || isBbgl

  const { headers } = options
  if (c_token) {
    return {
      // url: url,
      url: isNoGlzz ? url : `http://11.188.90.191:21525${accessUrl}?target_url=${targetUrl}`,
      // url: isNoGlzz ? url : `http://10.6.1.111:8082${accessUrl}?target_url=${targetUrl}`,
      // url: isNoGlzz
      //   ? url
      //   : `https://srthkf1.gczhyun.com:21530/glzz${accessUrl}?target_url=${targetUrl}`,
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
    url: isNoGlzz ? url : `http://11.188.90.191:21525${accessUrl}?target_url=${targetUrl}`,
    // url: isNoGlzz ? url : `http://10.6.1.111:8082${accessUrl}?target_url=${targetUrl}`,
    // url: isNoGlzz
    //   ? url
    //   : `https://srthkf1.gczhyun.com:21530/glzz${accessUrl}?target_url=${targetUrl}`,
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
