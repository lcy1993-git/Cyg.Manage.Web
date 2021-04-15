import request from '@/utils/request';
import { Moment } from 'moment';
import { cyRequest, baseUrl } from '../common';

export const GetEngineerProjectList = () => {
  return cyRequest<any>(() => request(`${baseUrl.webGis}/Engineer/GetEnums`, { method: 'GET' }));
};
