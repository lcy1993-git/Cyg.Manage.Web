import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

export const getDrawingList = (libId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Chart/GetList`, { method: 'POST', params: { libId } }),
  );
};

export const getUploadUrl = () => {
  return cyRequest(() => request(`${baseUrl.resource}/Chart/GetUrlSetting`, { method: 'GET' }));
};
