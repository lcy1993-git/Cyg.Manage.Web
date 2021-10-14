import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface EditPasswordParams {
  oldPwd: string;
  newPwd: string;
}

interface ChangeUserPhone {
  phone: string;
  code: string;
}

export const editPassword = (params: EditPasswordParams) => {
  return cyRequest(() =>
    request(`${baseUrl.common}/Users/ModifyPwd`, { method: 'POST', data: params }),
  );
};

interface UserInfo {
  companyId: string;
  companyName: string;
  email: string;
  id: string;
  isSuperAdmin: boolean;
  lastLoginDate: number;
  lastLoginIp: string;
  name: string;
  nickName: string;
  phone: string;
  roleName: string;
  roleType: number;
  roleTypeText: string;
  userName: string;
  userStatus: number;
  userStatusText: string;
  userType: number;
  userTypeText: string;
}

export const getUserInfo = () => {
  return cyRequest<UserInfo>(() =>
    request(`${baseUrl.project}/Manage/GetCurrentUserInfo`, { method: 'GET' }),
  );
};

export const editUserInfo = (params: any) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Manage/ModifyCurrentUserInfo`, {
      method: 'POST',
      data: { ...params },
    }),
  );
};

// 用户手机换绑
export const changeUserPhone = (params: ChangeUserPhone) => {
  return cyRequest(() =>
    request(`${baseUrl.common}/Users/BindPhone`, {
      method: 'POST',
      data: { ...params },
    }),
  );
};

// 用户手机绑定
export const bindUserPhone = (params: ChangeUserPhone) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Manage/Users/BindPhone`, { method: 'POST', data: { ...params } }),
  );
}

// 解绑手机号
export const unBindUserPhone = () => {
  return cyRequest(() =>
      request(`${baseUrl.common}/Users/unBindPhone`, { method: 'GET'})
  );
}

// 发送电子邮箱验证码
export const sendBindEmailCode = (email: string) => {
  return cyRequest(() =>
    request(`${baseUrl.common}/Users/SendBindEmailCode`, { method: 'POST', data: {email}})
  );
}

// 绑定电子邮箱
export const bindEmail = (email: string, code: string): Promise<any> => {
  return request(`${baseUrl.common}/Users/BindEmail`, { method: 'POST', data: { email, code } });
}

// 解绑电子邮箱
export const unBindEmail = () => {
  return cyRequest(() =>
      request(`${baseUrl.common}/Users/UnBindEmail`, { method: 'GET'})
  );
}
