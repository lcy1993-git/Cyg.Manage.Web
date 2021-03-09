import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

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
