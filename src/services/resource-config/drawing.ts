import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';
import qs from 'qs';

export const getDrawingList = (libId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Chart/GetList`, { method: 'POST', params: { libId } }),
  );
};

//密钥接口
interface SecurityParams {
  storageApi: string;
  uploadChartApiSecurity: string;
  uploadCompanyFileApiSecurity: string;
  uploadLineStressChartApiSecurity: string;
  logFileApiSecurity: string;
  projectEarlyWarnDay: string;
  setCompanyFileByCompanyId: string;
  webGisUrl: string;
  userNamePrefix: string;
  logoUrl: string;
  companyName: string;
  publicApi: string;
}

export const getUploadUrl = () => {
  return cyRequest<SecurityParams>(() =>
    request(`${baseUrl.resource}/Chart/GetUrlSetting`, { method: 'GET' }),
  );
};

//上传应力弧垂表图纸
export const uploadLineStressSag = (
  files: any[],
  params: any,
  requestSource: 'project' | 'resource' | 'upload',
  url: string,
) => {
  const formData = new FormData();
  files?.forEach((item) => {
    formData.append('file', item);
  });

  const uploadUrl = `${baseUrl[requestSource]}${url}?${qs.stringify(params)}`;

  return cyRequest<any[]>(() =>
    request(uploadUrl, {
      method: 'POST',
      data: formData,
      requestType: 'form',
    }),
  );
};

export const newUploadLineStressSag = (
  files: any[],
  params: any,
  requestSource: 'project' | 'resource' | 'upload',
  url: string,
) => {
  const formData = new FormData();
  files.forEach((item) => {
    formData.append('file', item);
  });

  const uploadUrl = `${baseUrl[requestSource]}${url}?${qs.stringify(params)}`;
  return request(uploadUrl, {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
};
