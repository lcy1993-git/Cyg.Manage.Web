import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface ResourceLibParams {
  libName: string;
  rootDirPath: string;
  dbName: string;
  version: string;
  remark: string;
}

interface ItemDetailData extends ResourceLibParams {
  //公司编号
  id: string;
}

//获取资源库详情
export const getResourceLibDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.resource}/ResourceLib/GetById`, { method: 'GET', params: { id } }),
  );
};

//新增资源库
export const addResourceLibItem = (params: ResourceLibParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ResourceLib/SaveCreate`, { method: 'POST', data: params }),
  );
};

//编辑资源库信息
export const updateResourceLibItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ResourceLib/Modify`, { method: 'POST', data: params }),
  );
};

// 删除资源库.?
export const deleteResourceLibItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ResourceLib/Delete`, { method: 'GET', params: { id } }),
  );
};

export const restartResourceLib = () => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ResourceLib/RestartService`, { method: 'POST' }),
  );
};
