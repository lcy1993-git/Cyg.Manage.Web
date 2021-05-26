import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

//技经物料库 - 获取区域属性列表
export const GetAreaTreeNod = () => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/SourceMaterial/GetAreaTreeNod`, { method: 'GET' })
  )
}

//技经物料库 - 分页列表
interface PageList {
  province: string;
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
    request(`${baseUrl.tecEco}/SourceMaterial/GetPageList`, { method: 'POST', data: params })
  )
}

//技经物料库 - 根据ID查询物料信息
export const GetMaterialLibraryById = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/SourceMaterial/GetMaterialLibraryById`, { method: 'POST', data: { id } })
  )
}
//技经物料库 - 新增资源库
interface MaterialLibrary {
  name: string;
  province: string;
  provinceName: string;
  releaseDate: string;
  remark: string;
  isDelete: boolean;
  id: string;
}
export const createMaterialLibrary = (params: MaterialLibrary) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/SourceMaterial/CreateMaterialLibrary`, { method: 'POST', data: params })
  )
}

//技经物料库 - 编辑物料资源
export const updateMaterialLibrary = (params: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/SourceMaterial/CreateMaterialLibrary`, { method: 'POST', data: params })
  )
}

//技经物料库 - 删除物料信息
export const deleteMaterialLibrary = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/SourceMaterial/DeleteMaterialLibrary`, { method: 'POST', data: { id } })
  )
}

//技经物料库 - 导入技经物料库物料数据（Excel）
export const importSourceMaterials = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/SourceMaterial/ImportSourceMaterials`, { method: 'POST', data: { id } })
  )
}

//技经物料库 - 获取物料库列表
export const getSourceMaterialLibrary = (province: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/SourceMaterial/GetSourceMaterialLibrary`, { method: 'POST', data: { province } })
  )
}

//技经物料库 - 获取物料库目录树
export const GetSourceMaterialLibraryCatalogue = (libId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/SourceMaterial/GetSourceMaterialLibraryCatalogue`, { method: 'POST', data: { libId } })
  )
}

//技经物料库 - 获取当前章节的物料数据（含子章节）
interface GetSourceMaterialItems {
  catalogueId: string;
  libId: string;
}
export const getSourceMaterialItems = (params: GetSourceMaterialItems) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/SourceMaterial/GetSourceMaterialItems`, { method: 'POST', data: params })
  )
}

//技经物料库 - 根据条件查询定额项目
interface SearchSourceMaterialItems {
  libId: string;
  key: string;
}
export const searchSourceMaterialItems = (params: SearchSourceMaterialItems) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/SourceMaterial/SearchSourceMaterialItems`, { method: 'POST', data: params })
  )
}