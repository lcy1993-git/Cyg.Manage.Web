import { extend, RequestOptionsInit } from 'umi-request';

const request = extend({
  credentials: 'include', // 默认请求是否带上cookie
});

// request拦截器, 改变url 或 options.
// @ts-ignore
request.interceptors.request.use(async (url: string, options: RequestOptionsInit) => {
  let c_token = localStorage.getItem("Authorization");
  if (c_token) {
    const {headers} = options;
    return (
      {
        url: url,
        options: { ...options, headers: {...headers,'Authorization': c_token} },
      }
    );
  }

  return (
    {
      url: url,
      options: { ...options },
    }
  );
})

// response拦截器, 处理response
request.interceptors.response.use((response, options) => {
  let token = response.headers.get("Authorization");
  if (token) {
    localStorage.setItem("Authorization", token);
  }
  return response;
});

export default request;