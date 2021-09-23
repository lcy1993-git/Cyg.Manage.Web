import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

/**
 * 将对象传参formData格式化
 * @param params 传参的对象
 * @returns 对象formData实例
 */
const formData = (params: Object) => {
  const form = new FormData();
  for (let k in params) {
    if (k === 'file' || k === 'files') {
      form.append(k, params[k]?.[0]);
    } else {
      form.append(k, params[k]);
    }
  }
  return form;
};

//获取说明书类别
export const getCategorys = () => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.project}/Instructions/GetCategorys`, { method: 'GET', params: { } }),
  );
};
//根据端口获取最新说明书
export const getLatestInstructions = (category:number) => {
  return cyRequest<{ id:string,fileName:string,fileId:string} >(() =>
    request(`${baseUrl.project}/Instructions/GetLatest?category=${category}`, { method: 'GET'}),
  );
};
//添加说明书
export const uploadCreate = (data: {
  "category": number,
  file:File
}) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.upload}/Upload/InstructionsFile?category=${data.category}`, {
      method: 'POST',
      data: formData(data),
    }),
  );
};
//添加说明书
export const instructionsCreate = (data: {
  "category": number,
  "fileId": string,
  "fileName": string
}) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Instructions/Create`, {
      method: 'POST',
      data
    }),
  );
};

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
