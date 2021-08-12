import request from '@/utils/request';
import { baseUrl, cyRequest } from '../common';
import { projectOperationLogParams, RefreshDataType } from '../index';

interface OverduesParams {
  companyId: string;
  companyName: string;
  value: number;
}

interface StatusParams {
  totalQty: number;
  designedQty: number;
  completionRate: number;
  items: object[];
}

export const getOverdues = (params: { limit: number }) => {
  return cyRequest<OverduesParams>(() =>
    request(`${baseUrl.project}/ProjectStatistics/GetOverdues`, { method: 'POST', data: params }),
  );
};

export const getStatus = () => {
  return cyRequest<StatusParams>(() =>
    request(`${baseUrl.project}/ProjectStatistics/GetStatus`, { method: 'GET' }),
  );
};

export const getSurveyRate = () => {
  return cyRequest<any>(() =>
    request(`${baseUrl.project}/ProjectStatistics/GetSurveyRate`, { method: 'GET' }),
  );
};

export const getComprehensiveProcessList = () => {
  return cyRequest<any>(() =>
    request(`${baseUrl.project}/ProjectStatistics/GetLeaderboardByCompany`, {
      method: 'POST',
      data: { limit: 9999 },
    }),
  );
};

export const getProjectProcessList = () => {
  return cyRequest<any>(() =>
    request(`${baseUrl.project}/ProjectStatistics/GetLeaderboardByProject`, {
      method: 'POST',
      data: { limit: 9999 },
    }),
  );
};

// 获取项目操作log
export const fetchProjectOperationLog = (params: projectOperationLogParams) => {
  return cyRequest<RefreshDataType[]>(() =>
    request(`${baseUrl.project}/ProjectStatistics/GetProjectOperateLog`, {
      method: 'POST',
      data: params,
    }),
  );
};

