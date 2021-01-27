// An highlighted block
/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';


/**
 * 异常处理程序
 */
const errorHandler = (error: any) => {
  const { response } = error;

  if (response && response.status) {
    const errorText = response.message;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }

  return response;
};
const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie

});

// request拦截器, 改变url 或 options.
request.interceptors.request.use(async (url, options) => {

  let c_token = localStorage.getItem("Authorization");
  console.log(c_token)
  if (c_token) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': c_token
    };
    return (
      {
        url: url,
        options: { ...options, headers: headers },
      }
    );
  } else {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': c_token
    };
    return (
      {
        url: url,
        options: { ...options },
      }
    );
  }

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