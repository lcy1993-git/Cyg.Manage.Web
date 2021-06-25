import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

export enum BelongRoleEnum {
  '启用' = 1,
  '禁用',
}

interface AuthorizationItemParams {
  //模板名
  name: string;

  //是否禁用
  isDisable: number;

  //备注
  remark: string;

  modules: any[];
}

interface ItemDetailData extends AuthorizationItemParams {
  id: string;
}

interface FunctionItem {
  id: string;
  name: string;
  hasPermission: boolean;
}

interface TreeDataItem {
  // 数据id
  id: string;
  name: string;
  hasPermission: boolean;
  functions: FunctionItem[];
  children: TreeDataItem[];
  isDisable: boolean;
}

//获取选中数据
export const getAuthorizationDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/AuthTemplate/GetById`, { method: 'GET', params: { id } }),
  );
};

//新增模板
export const addAuthorizationItem = (params: AuthorizationItemParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/AuthTemplate/Create`, { method: 'POST', data: params }),
  );
};

//编辑模板
export const updateAuthorizationItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/AuthTemplate/Modify`, { method: 'POST', data: params }),
  );
};

// 删除模板
export const deleteAuthorizationItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/AuthTemplate/DeleteById`, { method: 'GET', params: { id } }),
  );
};

// 更改状态
export const updateAuthorizationItemStatus = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/AuthTemplate/ChangeState`, { method: 'GET', params: { id } }),
  );
};

// 获取功能模块列表的数据
export const getAuthorizationTreeList = (id?: string): Promise<TreeDataItem[]> => {
  return cyRequest<TreeDataItem[]>(() =>
    request(`${baseUrl.project}/AuthTemplate/GetModules`, { method: 'GET', params: { id } }),
  );
};

// 更新功能模块列表的数据
export const updateAuthorizationModules = (params: any) => {
  return cyRequest<TreeDataItem[]>(() =>
    request(`${baseUrl.project}/AuthTemplate/UpdateModules`, { method: 'POST', data: params }),
  );
};

interface BatchAddAuthorizationParams {
  templateId: string;
  authorizeType: 1 | 2;
  objectIds: string[];
}

// 批量授权
export const batchAddAuthorization = (params: BatchAddAuthorizationParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/AuthTemplate/AddAuthorize`, { method: 'POST', data: params }),
  );
};

// 批量移除授权
// 批量授权
export const batchRemoveAuthorization = (params: BatchAddAuthorizationParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/AuthTemplate/RemoveAuthorize`, { method: 'POST', data: params }),
  );
};
