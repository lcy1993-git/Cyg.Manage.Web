import { RequestDataType, RequestDataCommonType } from './common.d';
import { requestBaseUrl } from '../../public/config/request';
import { message } from 'antd';
import { request, history } from 'umi';
import tokenRequest from "@/utils/request"

const { NODE_ENV } = process.env;

const devBaseUrl = {
  project: '/project/api',
  common: '/common/api',
};

export const baseUrl = NODE_ENV === 'development' ? devBaseUrl : requestBaseUrl;

export const cyRequest = <T extends {}>(func: () => Promise<RequestDataType<T>>): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    const res = await func();

    const { code, content, isSuccess } = res;
    if (isSuccess && code === 200) {
      resolve(content);
    } else {
      if (code === 401) {
        history.push('/login');
      }
      message.error(res.message);
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

export const getDataByUrl = (url: string, params: object) => {
  return cyRequest<any[]>(() => tokenRequest(`${baseUrl.project}${url}`, { method: 'Get', data: params }));
};


export const testUpload = (files: any) => {
  const formData = new FormData();
  files.forEach((item) => {
    formData.append("file",item.originFileObj)
  });
  return cyRequest<any[]>(() => tokenRequest(`${baseUrl.project}/Dictionary/Import`, { method: 'POST',data: formData, requestType: "form"}));
}