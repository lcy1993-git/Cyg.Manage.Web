import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';
import type {SuppliesLibraryData} from "@/pages/technology-economic/supplies-library";

/**
 * 将对象传参formData格式化
 * @param params 传参的对象
 * @returns 对象formData实例
 */
const formData = (params: Object) => {
  const form = new FormData();
  for (const k in params) {
    if(k === 'file') {
      form.append(k, params[k]?.[0])
    }else{
      form.append(k, params[k]);
    }
  }
  return form;
}
// 查询总算表数据
export const materialMappingQuotaModifyStatus
  = (MaterialId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/MaterialMappingQuotaModifyStatus`,
      { method: 'GET', params: { MaterialId } }),
  );
}


// 新增物料映射
export const addSourceMaterialMappingQuota = (data: SuppliesLibraryData) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/AddSourceMaterialMappingQuota`,
      { method: 'POST', data: formData(data) }),
  );
}

// 查询物料映射库
export const getMaterialMappingQuotaList = (data: {
  "mappingType": 1,
  "sourceMaterialMappingLibraryId": string,
  "sourceMaterialLibraryId": string,
  "sourceMaterialLibraryCatalogueId"?: string,
  "pageIndex": number,
  "pageSize": number,
  "keyWord"?: string
}) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/GetMaterialMappingQuotaList`,
      { method: 'POST', data }),
  );
}

// 获取映射物料库列表
export const getSourceMaterialMappingLibraryList = (data: {
  "pageIndex": number,
  "pageSize": number,
  "sort"?: {
    "propertyName": string,
    "isAsc": boolean
  },
  "keyWord": string
}) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/GetSourceMaterialMappingLibraryList`,
      { method: 'POST', data}),
  );
}
// 删除
export const deleteMaterialMappingQuota = (materialId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/DeleteMaterialMappingQuota`,
      { method: 'GET', params: { materialId } }),
  );
}
