import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface AuthorizationItemParams {
  //模板名
  name: string;

  //是否禁用
  isDisable: number;

  //备注
  remark: string;
}

interface ItemDetailData extends AuthorizationItemParams {
  id: string;
}

//获取选中数据
export const getAuthorizationDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/Role/GetById`, { method: 'GET', params: { id } }),
  );
};

//新增角色
export const addAuthorizationItem = (params: AuthorizationItemParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Authorization/Create`, { method: 'POST', data: params }),
  );
};

//编辑角色名
export const updateAuthorizationItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Authorization/Modify`, { method: 'POST', data: params }),
  );
};

// 删除
export const delectAuthorizationItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Authorization/DeleteById`, { method: 'GET', params: { id } }),
  );
};

// 更改状态
export const updateAuthorizationItemStatus = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Authorization/ChangeState`, { method: 'GET', params: { id } }),
  );
};
