import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';
//工作交接接口

interface RecevierParamsItem {
  userId: string;
  clientCategory: number | undefined;
  isCompanyGroupIdentity: boolean | undefined;
}

interface HandoverParamsItem {
  engineerIds?: string[];
  projectIds?: string[];
  companyGroupIds?: string[];
  userId: string;
  receiveUserId: string;
  taskCategory?: number; //作业类别（勘察/设计）
}

// 获取接受用户列表
export const getReceiver = (params: RecevierParamsItem) => {
  return cyRequest<object[]>(() =>
    request(`${baseUrl.project}/UserHandover/GetReceiveUsers`, { method: 'POST', data: params }),
  );
};

//获取交接部组列表
export const getCompanyGroups = (userId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/UserHandover/GetCompanyGroups`, {
      method: 'GET',
      params: { userId },
    }),
  );
};

//获取交接项目列表（项目/勘察/设计）
export const getProjectsInfo = (params: { userId: string; category: number }) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/UserHandover/GetProjects`, { method: 'POST', data: params }),
  );
};

//交接工程
export const handoverEngineer = (params: HandoverParamsItem) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/UserHandover/HandoverEngineer`, { method: 'POST', data: params }),
  );
};

//交接作业
export const handoverTask = (params: HandoverParamsItem) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/UserHandover/HandoverTask`, { method: 'POST', data: params }),
  );
};

//交接公司部组
export const handoverCompanyGroup = (params: HandoverParamsItem) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/UserHandover/HandoverCompanyGroup`, {
      method: 'POST',
      data: params,
    }),
  );
};
