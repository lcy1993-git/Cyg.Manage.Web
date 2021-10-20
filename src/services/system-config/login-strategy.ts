import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface LoginStrategyParams {
  key: string;
  authorizeType: number;
  remark?: string;
}

//新增电力公司
export const createLoginStrategy = (params: LoginStrategyParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/LoginAuthorize/Create`, { method: 'POST', data: params }),
  );
};

// 删除
export const deleteLoginStrategy = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/LoginAuthorize/DeleteById`, { method: 'GET', params: { id } }),
  );
};
