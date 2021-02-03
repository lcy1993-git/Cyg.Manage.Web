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

}

// 获取搜索结果列表
export const getLogManageList = (parmas: SearchLogItemParams) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/Log/GetPagedList`, { method: 'POST', data: parmas }),
  );
};

// 获取一条数据
export const getLogManageDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/Log/GetById`, { method: 'GET', params: { id } }),
  );
};

// 获取应用程序列表
export const getApplicationsList = () => {
  return cyRequest(() => request(`${baseUrl.project}/Log/GetApplications`, { method: 'GET' }));
};

// 删除
export const delectReportLog = (id: string) => {
    return cyRequest(() =>
      request(`${baseUrl.project}/Module/DeleteById`, { method: 'GET', params: { id } }),
    );
  };
