import { extend, RequestOptionsInit } from 'umi-request';
const { NODE_ENV } = process.env;

const request = extend({
  prefix: NODE_ENV === 'development' ? "/api" : ""
});

// request拦截器, 改变url 或 options.
// @ts-ignore
request.interceptors.request.use(async (url: string, options: RequestOptionsInit) => {
  let c_token = localStorage.getItem("Authorization");
  const {headers} = options;
  if (c_token) {
    return (
      {
        url: url,
        options: { ...options, headers: {...headers,'Authorization': c_token,'Access-Control-Allow-Credentials': true,'Access-Control-Allow-Headers': 'x-requested-with'} },
      }
    );
  }

  return (
    {
      url: url,
      options: { ...options,headers: {'Access-Control-Allow-Credentials': true,'Access-Control-Allow-Headers': 'x-requested-with'}},
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