import { request } from 'umi';
import { cyRequest, baseUrl } from '../../common';

interface RoleManageItemParams {
  //角色名
  roleName: string;

  //角色类型
  roleType: number;

  //备注
  remark: string;

  //角色类型名称
  // roleTypeText: string;
}

interface ItemDetailData extends RoleManageItemParams {
  id: string;
}

//获取选中数据
export const getRoleManageDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl}/Role/GetById`, { method: 'GET', params: { id } }),
  );
};

//新增角色
export const addRoleManageItem = (params: RoleManageItemParams) => {
  return cyRequest(() => request(`${baseUrl}/Role/Create`, { method: 'POST', data: params }));
};

//编辑角色名
export const updateRoleManageItem = (params: ItemDetailData) => {
  return cyRequest(() => request(`${baseUrl}/Role/Modify`, { method: 'POST', data: params }));
};
