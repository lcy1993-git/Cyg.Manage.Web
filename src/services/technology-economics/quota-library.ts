import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';
// 获取定额库列表
export const getQuotaLibrary = () => {
  return cyRequest(() => 
    request(`${baseUrl.tecEco}/QuotaLibraryManager/GetPageList`, {method: 'POST'})
  )
}
// 修改定额库
interface ModifyParams {
  id: string;
  name: string;
  remark: string;
}
export const modifyQuotaLibrary = (params: ModifyParams) => {
  return cyRequest(() => 
    request(`${baseUrl.tecEco}/QuotaLibraryManager/SaveModify`, {method: 'POST', data: params})
  )
}
// 添加定额库
interface CreateParams {
  name: string;
  category: number;
  releaseDate: number;
  remark: string;
}
export const createQuotaLibrary = (params: CreateParams) => {
  return cyRequest(() => 
    request(`${baseUrl.tecEco}/QuotaLibraryManager/SaveCreate`, {method: 'POST', data: params})
  )
}
//删除定额库
export const delQuotaLibrary = (id: string) => {
  return cyRequest(() => 
    request(`${baseUrl.tecEco}/QuotaLibraryManager/Delete`, {method: 'GET', params: {id}})
  )
}

// 定额库目录列表
export const getCatalogueList = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibraryCatalogueManager/GetList`, { method: 'GET', params: { libId: "1357588635508068352" } }),
);
}

// 定额库目录

// 定额库目录树详情
export const getQuotaLibraryCatalogue = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibraryManager/GetDetail`, { method: 'GET', params: { libId: "1357588635508068352" } }),
);
}

// 获取定额目录树
export const getTreeQuotaLibraryCatalogue = (libId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}QuotaLibraryCatalogueManager/GetTree`, { method: 'GET', params: { libId: "1357588635508068352" } }),
);
}