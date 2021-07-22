import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface ProjectPermissionItemParams {
  id?: string;
  name: string;
  remark: string;
  items: any[];
}

//新增&编辑项目权限组
export const addEditProPermissionItem = (params: ProjectPermissionItemParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ProjectAuthorityGroup/Save`, { method: 'POST', data: params }),
  );
};

//获取项目权限组
export const getProPermissionItem = (id: string) => {
  return cyRequest<ProjectPermissionItemParams>(() =>
    request(`${baseUrl.project}/ProjectAuthorityGroup/GetDetailById`, {
      method: 'GET',
      params: { id },
    }),
  );
};

// 删除权限组
export const deleteProPermissionItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ProjectAuthorityGroup/DeleteById`, {
      method: 'GET',
      params: { id },
    }),
  );
};

// 更改状态
export const updateProPermissionStatus = (params: { id: string; isDisable: boolean }) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ProjectAuthorityGroup/ModifyStatus`, {
      method: 'POST',
      data: params,
    }),
  );
};

//添加授权
export const addAuthorize = (params: { groupId: string; objectIds: string[] }) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ProjectAuthorityGroup/AddAuthorize`, {
      method: 'POST',
      data: params,
    }),
  );
};

//移除授权
export const removeAuthorize = (params: { groupId: string; objectIds: string[] }) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ProjectAuthorityGroup/RemoveAuthorize`, {
      method: 'POST',
      data: params,
    }),
  );
};
