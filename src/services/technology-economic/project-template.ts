import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

// 工程量模板 - 分页列表查询
interface PageList {
  pageIndex: number;
  pageSize: number;
  sort?: {
    propertyName: string;
    isAsc: boolean;
  },
  keyWord?: string;
}
export const getPageList = (params: PageList) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuantityTemplate/GetPageList`, { method: 'POST', data: params })
  )
}

// 工程量模板 - 保存导入
export const saveImport = () => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuantityTemplate/SaveImport`, { method: 'POST', data: null })
  )
}

// 工程量模板 - 新增模板数据项
interface CreateItem {
  number: string;
  name: string;
  id: string;
  pid: string;
  type: number;
  projectCode: string;
  attribute: string;
  unit: string;
  costCode: string;
  createBy: string;
  isDeleted: boolean;
}
export const createItem = (params: CreateItem) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuantityTemplate/CreateItem`, { method: 'POST', data: params })
  )
}

// 工程量模板 - 获取工程量章节树
export const getTemplateTree = (type: number) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuantityTemplate/GetQuantityTemplateTree`, { method: 'POST', data: {type} })
  )
}

// 工程量模板 - 类型字典
export const getTemplateType = () => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuantityTemplate/GetQuantityTemplateType`, { method: 'POST' })
  )
}

// 工程量模板 - 根据ID查询数据项
export const getItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/i/QuantityTemplate/GetItem`, { method: 'POST', data: {id} })
  )
}

// 工程量模板 - 编辑数据项
interface UpdataItem {
  id: string;
  number: string;
  name: string;
  pid: string;
  type: number;
  projectCode: string;
  attribute: string;
  unit: string;
  costCode: string;
  createBy: string;
  isDeleted: boolean;
}
export const updateItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/i/QuantityTemplate/UpdateItem`, { method: 'POST', data: {id} })
  )
}

// 工程量模板 - 删除数据项
export const deleteItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/i/QuantityTemplate/DeleteItem`, { method: 'POST', data: {id} })
  )
}

// 工程量模板 - 重启资源服务
export const restart = () => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuantityTemplate/CleanMaterialTemplateCache`, { method: 'POST' })
  )
}
