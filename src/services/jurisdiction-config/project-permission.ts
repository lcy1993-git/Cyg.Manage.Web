import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

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

//获取项目类型
export const getProjectTypes = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ProjectAuthorityGroup/GetProjectTypes`, { method: 'GET', params: { id } }),
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
