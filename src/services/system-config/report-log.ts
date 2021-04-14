import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

// 获取一条数据
export const getFileLogDetail = (id: string) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.project}/FileLog/GetById`, { method: 'GET', params: { id } }),
  );
};

// 删除
export const deleteReportLog = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/FileLog/DeleteById`, { method: 'GET', params: { id } }),
  );
};
