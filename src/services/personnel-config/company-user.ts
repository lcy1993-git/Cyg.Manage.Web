import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

export enum CompanyUserEnum {
  '启用' = 1,
  '禁用',
}

interface CompanyUserItemParams {
  groupIds: string[];
  comapnyGroups: object[];
  companyName: string;
  userName: string;
  phone: string;
  email: string;
  nickName: string;
  name: string;
  userStatus: number;
  lastLoginIp: string;
  lastLoginDate: Date;
  authorizeClient: number;
  pwd: string;
}

export interface ItemDetailData extends CompanyUserItemParams {
  id: string;
  pwd: string;
}

//获取选中数据
export const getCompanyUserDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/CompanyUser/GetById`, { method: 'GET', params: { id } }),
  );
};

//新增公司用户
export const addCompanyUserItem = (params: CompanyUserItemParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyUser/Create`, { method: 'POST', data: params }),
  );
};

//批量新增公司用户
export const BatchAddCompanyUserItem = (params: CompanyUserItemParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyUser/BatchCreate`, { method: 'POST', data: params }),
  );
};

//编辑用户
export const updateCompanyUserItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyUser/Modify`, { method: 'POST', data: params }),
  );
};

//修改（重置）密码
export const resetItemPwd = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyUser/ResetPwd`, { method: 'POST', data: params }),
  );
};

// 更改状态
export const updateItemStatus = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyUser/ChangeState`, { method: 'GET', params: { id } }),
  );
};

export interface GetUserTreeByGroup {
  text: string;
  id: string;
  children: GetUserTreeByGroup[];
}

interface CompanyGroupTree {
  companyGroupId: string;
  clientType: number;
}

//按部组获取公司用户
export const getUserTreeByGroup = (params: CompanyGroupTree) => {
  return cyRequest<GetUserTreeByGroup[]>(() =>
    request(`${baseUrl.project}/CompanyUser/GetTreeByGroup`, { method: 'POST', data: params }),
  );
};
