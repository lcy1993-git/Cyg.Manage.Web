import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

const formData = (params: Object) => {
  const form = new FormData();
  for (let k in params) {
    if(k === 'file') {
      form.append(k, params[k][0])
    }else{
      form.append(k, params[k]);
    }
  }
  return form;
}

// ***定额库***
export interface CreateQuotaLibrary {
  materialMachineLibraryId: string;
  name: string;
  quotaScope: 1 | 2;
  publishDate: string;
  publishOrg: string;
  year: number;
  industryType: 1 | 2 | 3;
  majorType: 1 | 2;
  remark: string;
  enabled: boolean;
  file: File;
}

// 创建定额库
export const createQuotaLibrary = (params: CreateQuotaLibrary) => {
  // const formData = new FormData();
  // for (let k in params) {
  //   if(k === 'file') {
  //     formData.append(k, params[k][0])
  //   }else{
  //     formData.append(k, params[k]);
  //   }
  // }
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibrary/CreateQuotaLibrary`, { method: 'POST', data: formData(params) })
  )
}

// 删除定额库
export const deleteQuotaLibrary = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibrary/DeleteQuotaLibrary`, { method: 'GET', params: { id } }),
  );
}

// ***人材机库***
interface GetPage {
  pageIndex: number;
  pageSize: number;
  sort?:{
    propertyName?: string;
    isAsc?: boolean;
  }
  keyWord?: string;
}

interface CreateMaterialMachineLibrary {
  name: string;
  publishDate: string;
  publishOrg: string;
  year: number;
  IndustryType: 1 | 2 | 3;
  remark: string;
  enabled: boolean;
  file: File;
}

// 分页列表
export const queryMaterialMachineLibraryPager = (params: GetPage) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/MaterialMachineLibrary/QueryMaterialMachineLibraryPager`, { method: 'POST', data: params })
  )
}

// 创建人材机库
export const createMaterialMachineLibrary = (params: CreateMaterialMachineLibrary) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/MaterialMachineLibrary/CreateMaterialMachineLibrary`, { method: 'POST', data: formData(params) })
  )
}

// 删除人材机库
export const deleteMaterialMachineLibrary = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/MaterialMachineLibrary/DeleteMaterialMachineLibrary`, { method: 'GET', params: { id } }),
  );
}

// 人材机库下目录列表
export const queryMaterialMachineLibraryCatalogList = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/MaterialMachineLibrary/queryMaterialMachineLibraryCatalogList`, { method: 'GET', params: { id } }),
  );
}

