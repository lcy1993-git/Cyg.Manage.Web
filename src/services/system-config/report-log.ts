import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface SearchLogItemParams {
  //应用程序
  application: string;

  //日志级别
  logLevel: string;

  //跟踪编号
  traceId: string;

  //用户（请求，响应，异常）内容
  message: string;

  //开始搜索日期
  beginTime: Date;

  endTime: Date;
}

interface ItemDetailData extends SearchLogItemParams {
  id: string;
  clientIp: string;
  content: any
}

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
