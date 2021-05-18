import { message } from 'antd';
import { request, history } from 'umi';
import tokenRequest from '@/utils/request';
import { requestBaseUrl } from '../../public/config/request';
import { RequestDataType, RequestDataCommonType } from './common.d';
import { isArray } from 'lodash';

const { NODE_ENV } = process.env;

const devBaseUrl = {
  project: '/project/api',
  common: '/common/api',
  upload: '/upload/api',
  resource: '/resource/api',
  webGis: '/webGis/api',
  webGis2: '/webGis2/api',
  comment: '/Comment/api',
  component: '/Component/api',
  material: '/Material/api/',
  projectVisualization: '/ProjectVisualization/api',
  tecEco: '/tecEco/api',
  review: '/review/api',
  // gis
  resourceV1: '/resource/api',
  manage: '/manage/api',
  geoserver: '/geoserver',
};

// interface UrlSelectParams {
//   requestSource: 'project' | 'resource';
// }

export const baseUrl = NODE_ENV === 'development' ? devBaseUrl : requestBaseUrl;

export const cyRequest = <T extends {}>(func: () => Promise<RequestDataType<T>>): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    const res = await func();

    const { code, content, isSuccess } = res;
    if (isSuccess && code === 200) {
      resolve(content);
    } else {
      if (code === 401) {
        history.push('/again-login');
        //message.error('会话超时，已自动跳转到登录界面');
      } else {
        if (res.content && isArray(res.content) && res.content.length > 0) {
          const errorMsgArray = res.content.map((item) => item.errorMessages).flat();
          const filterErrorMsg = errorMsgArray.filter((item, index, arr) => {
            return arr.indexOf(item) == index;
          });
          const showErrorMsg = filterErrorMsg.join('\n');
          message.error(showErrorMsg);
        } else {
          message.error(res.message);
        }
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
  requestSource: 'common' | 'project' | 'resource' | 'tecEco' | 'material' | 'component',
  requestType = 'get',
  postType = 'body',
  libId: string,
) => {
  const requestBaseUrl = baseUrl[requestSource];

  if (requestType === 'get') {
    return cyRequest<any[]>(() =>
      tokenRequest(`${requestBaseUrl}${url}`, { method: requestType, params }),
    );
  }
  if (postType === 'body') {
    return cyRequest<any[]>(() =>
      tokenRequest(`${requestBaseUrl}${url}`, { method: requestType, data: params }),
    );
  }
  return cyRequest<any[]>(() =>
    tokenRequest(`${requestBaseUrl}${url}`, { method: requestType, params: { libId } }),
  );
};

interface GetCommonSelectDataParams {
  url: string;
  params?: any;
  requestSource?: 'common' | 'project' | 'resource';
  method?: 'get' | 'post';
  postType?: 'body' | 'query';
}

export const getCommonSelectData = <T = any>(data: GetCommonSelectDataParams) => {
  const { url, params, requestSource = 'project', method = 'get', postType } = data;

  const requestBaseUrl = baseUrl[requestSource];

  if (method === 'post') {
    return cyRequest<T[]>(() => tokenRequest(`${requestBaseUrl}${url}`, { method, data: params }));
  }
  if (method === 'get' && postType) {
    return cyRequest<T[]>(() => tokenRequest(`${requestBaseUrl}${url}`, { method, data: params }));
  }
  return cyRequest<T[]>(() => tokenRequest(`${requestBaseUrl}${url}`, { method, params }));
};

export const commonUpload = (
  url: string,
  files: any[],
  name: string = 'file',
  requestSource: 'project' | 'resource' | 'upload',
  // postType: 'body' | 'query',
) => {
  const requestUrl = baseUrl[requestSource];
  const formData = new FormData();
  files.forEach((item) => {
    formData.append(name, item);
  });

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

//导出权限
export const exportAuthority = (url: string, params: any) => {
  return tokenRequest(`${baseUrl.project}${url}`, {
    method: 'POST',
    data: { ...params },
    responseType: 'blob',
  });
};

//版本更新内容

interface VersionParams {
  productCode: string;
  moduleCode: string;
  versionNo: string;
  serverCode: string;
}

const versionUrl = 'http://service.sirenmap.com:8101/api/Version/Get';

export const getVersionUpdate = (params: VersionParams) => {
  return request(versionUrl, { method: 'POST', data: params });
};
