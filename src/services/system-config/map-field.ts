import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface MapFieldItemParams {
  deviceType: string;
  dsName: string;
  responseName: string;
  postGISName: string;
  pgModelName: string;
  description: string;
}

interface ItemDetailData extends MapFieldItemParams {
  id: string;
}

//获取选中数据
export const getMapFieldDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/MapField/GetById`, { method: 'GET', params: { id } }),
  );
};

//新增字段映射
export const addMapFieldItem = (params: MapFieldItemParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/MapField/Create`, { method: 'POST', data: params }),
  );
};

//编辑字段映射
export const updateMapFieldItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/MapField/Modify`, { method: 'POST', data: params }),
  );
};

// 删除字段映射
export const deleteMapFieldItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/MapField/DeleteById`, { method: 'GET', params: { id } }),
  );
};
