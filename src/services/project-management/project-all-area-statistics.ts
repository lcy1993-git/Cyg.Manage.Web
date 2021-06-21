import request from '@/utils/request';
import { baseUrl, cyRequest } from '../common';

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
  return cyRequest(() =>
    request(`${baseUrl.project}/ProjectStatistics/GetSurveyRate`, { method: 'GET' }),
  );
};
