import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface EditPasswordParams {
    pwd: string
    newPwd: string
}

interface ChangeUserPhone {
  phone: string;
  code: string;
}

export const editPassword = (params: EditPasswordParams) => {
    return cyRequest(() =>
        request(`${baseUrl.project}/Manage/ModifyCurrentUserPwd`, { method: 'POST', data: params}),
    );
}

interface UserInfo {
    companyId: string
    companyName: string
    email: string
    id: string
    isSuperAdmin: boolean
    lastLoginDate: number
    lastLoginIp: string
    name: string
    nickName:string
    phone: string
    roleName: string
    roleType: number
    roleTypeText: string
    userName: string
    userStatus: number
    userStatusText: string
    userType: number
    userTypeText: string
}

export const getUserInfo = () => {
    return cyRequest<UserInfo>(() =>
        request(`${baseUrl.project}/Manage/GetCurrentUserInfo`, { method: 'GET'})
    );
}

export const editUserInfo = (params: any) => {
    return cyRequest(() =>
        request(`${baseUrl.project}/Manage/ModifyCurrentUserInfo`, { method: 'POST', data: {...params}})
    );
}

// 用户手机换绑
export const changeUserPhone = (params: ChangeUserPhone) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Manage/ModifyCurrentUserPhone`, { method: 'POST', data: {...params}})
  );
}

// 用户手机绑定
export const bindUserPhone = (params: ChangeUserPhone) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Manage/Users/BindPhone`, { method: 'POST', data: {...params}})
  );
}