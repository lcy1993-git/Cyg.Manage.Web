import { request } from 'umi';
import { cyRequest, baseUrl } from '../../common';

export enum BelongManageEnum {
  '启用' = 1,
  '禁用',
}

export enum BelongUserRoleEnum {
  '管理员' = 1,
  '超级管理员',
  '公司管理员',
}
export enum BelongProvinceEnum {
  北京 = '北京',
  南京 = '南京',
  四川 = '四川',
  云南 = '云南',
}

interface ManageUserItemParams {
  companyName: string;
  provinceName: string;
  roleName: string;
  roleType: number;
  userName: string;
  phone: string;
  email: string;
  nickName: string;
  name: string;
  userStatus: number;
  lastLoginIp: string;
  lastLoginDate: Date;
  pwd: string;
}

interface AddManageUserItem extends ManageUserItemParams {
  roleId: string;
  province: string;
  companyId: string;
}

interface ItemDetailData extends ManageUserItemParams {
  id: string;
}

//获取选中数据
export const getManageUserDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl}/ManageUser/GetById`, { method: 'GET', params: { id } }),
  );
};

//新增用户
export const addManageUserItem = (params: AddManageUserItem) => {
  return cyRequest(() => request(`${baseUrl}/ManageUser/Create`, { method: 'POST', data: params }));
};

//编辑用户
export const updateManageUserItem = (params: ItemDetailData) => {
  return cyRequest(() => request(`${baseUrl}/ManageUser/Modify`, { method: 'POST', data: params }));
};

//修改（重置）密码
export const resetItemPwd = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl}/ManageUser/ResetPwd`, { method: 'POST', data: params }),
  );
};

// 更改状态
export const updateItemStatus = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl}/ManageUser/ChangeState`, { method: 'GET', params: { id } }),
  );
};
