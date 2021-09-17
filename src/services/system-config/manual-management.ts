import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';



//获取说明书类别
export const getCategorys = () => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.project}/Instructions/GetCategorys`, { method: 'GET', params: { } }),
  );
};

// //新增字段映射
// export const addMapFieldItem = (params: MapFieldItemParams) => {
//   return cyRequest(() =>
//     request(`${baseUrl.project}/MapField/Create`, { method: 'POST', data: params }),
//   );
// };
//
// //编辑字段映射
// export const updateMapFieldItem = (params: ItemDetailData) => {
//   return cyRequest(() =>
//     request(`${baseUrl.project}/MapField/Modify`, { method: 'POST', data: params }),
//   );
// };
//
// // 删除字段映射
// export const deleteMapFieldItem = (id: string) => {
//   return cyRequest(() =>
//     request(`${baseUrl.project}/MapField/DeleteById`, { method: 'GET', params: { id } }),
//   );
// };
