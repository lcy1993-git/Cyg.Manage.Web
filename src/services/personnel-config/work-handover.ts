import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';
//工作交接接口

interface RecevierParamsItem {
  userId: string;
  clientCategory: number;
  isCompanyGroupIdentity: boolean;
}

// 获取接受用户列表
export const getReceiver = (params: RecevierParamsItem) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/UserHandover/GetReceiveUsers`, { method: 'POST', data: params }),
  );
};

//获取交接部组列表

