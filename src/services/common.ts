import { RequestDataType, RequestDataCommonType } from './common.d';
import { requestBaseUrl } from '../../public/config/request';
import { message } from 'antd';
import { request, history } from 'umi';
import tokenRequest from '@/utils/request';

const { NODE_ENV } = process.env;

const devBaseUrl = {
  project: '/project/api',
  common: '/common/api',
  upload: '/upload/api',
  resource: '/resource/api',
};

interface UrlSelectParams {
  requestSource: 'project' | 'resource';
}

export const baseUrl = NODE_ENV === 'development' ? devBaseUrl : devBaseUrl;

export const cyRequest = <T extends {}>(func: () => Promise<RequestDataType<T>>): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    const res = await func();

    const { code, content, isSuccess } = res;
    if (isSuccess && code === 200) {
      resolve(content);
    } else {
      if (code === 401) {
        history.push('/401');
      } else {
        message.error(res.message);
      }
      reject(res.message);
    }
  });
};

export const cyCommonRequest = <T extends {}>(
  func: () => Promise<RequestDataCommonType>,
): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    const res = await func();

    const { code, isSuccess } = res;
    if (isSuccess && code === 200) {
      resolve((res as unknown) as T);
    } else {
      message.error(res.message);
      reject(res.message);
    }
  });
};

export enum SendSmsType {
  '登录',
  '账户绑定',
  '修改密码',
  '重置密码',
  '修改注册手机号',
}

// 获取短信接口
interface GetSmsCodeProps {
  phoneNum: string;
  sendSmsType: SendSmsType;
}

export const getSmsCode = (params: GetSmsCodeProps) => {
  return cyCommonRequest(() =>
    request(`${baseUrl.common}/ExternalApi/SendSms`, {
      method: 'GET',
      params: { ...params, sendSmsType: params.sendSmsType },
    }),
  );
};

export const getDataByUrl = (
  url: string,
  params: object,
  requestSource: 'common' | 'project' | 'resource',
  requestType = 'get',
  postType = 'body',
  libId: string,
) => {
  const requestBaseUrl = baseUrl[requestSource];
  if (requestType === 'get') {
    return cyRequest<any[]>(() =>
      tokenRequest(`${requestBaseUrl}${url}`, { method: requestType, params }),
    );
  } else if (postType === 'body') {
    return cyRequest<any[]>(() =>
      tokenRequest(`${requestBaseUrl}${url}`, { method: requestType, data: params }),
    );
  } else {
    return cyRequest<any[]>(() =>
      tokenRequest(`${requestBaseUrl}${url}`, { method: requestType, params: { libId } }),
    );
  }
};

export const commonUpload = (
  url: string,
  files: any[],
  name: string = 'file',
  requestSource: 'project' | 'resource' | 'upload',
  postType: 'body' | 'query',
) => {
  const requestUrl = baseUrl[requestSource];
  const formData = new FormData();
  files.forEach((item) => {
    formData.append(name, item);
  });
  console.log(postType);

  return cyRequest<any[]>(() =>
    tokenRequest(`${requestUrl}${url}`, {
      method: 'POST',
      data: formData,
      requestType: 'form',
    }),
  );
};

export const commonExport = (url: string, params: any, selectIds: string[]) => {
  return tokenRequest(`${baseUrl.project}${url}`, {
    method: 'POST',
    data: { ...params, ids: selectIds },
    responseType: 'blob',
  });
};
