import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface SourceDetailParams {
  id: string;
  sourceId: string;
  sourceDbName: string;
  compareId: string;
  compareDbName: string;
  progressRate: number;
  status: number;
  statusText: string;

  error: string;
  startDate: Date;
  startDateText: string;
  completionDate: Date;
  completionDateText: string;
}

//获取单条模块数据详情
export const getSourceCompareDetail = (id: string) => {
  return cyRequest<SourceDetailParams>(() =>
    request(`${baseUrl.resource}/SourceCompare/GetById`, { method: 'GET', params: { id } }),
  );
};

export const addSourceCompareCategory = (params: object) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/SourceCompare/CreateCompareCategory`, {
      method: 'POST',
      data: params,
    }),
  );
};
