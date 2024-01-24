import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

interface ResourceLibParams {
  libName: string
  rootDirPath: string
  dbName: string
  version: string
  remark: string
  isDisabled: boolean
}

interface ItemDetailData extends ResourceLibParams {
  //公司编号
  id: string
}

//获取资源库详情
export const getResourceLibDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.resource}/ResourceLib/GetById`, { method: 'GET', params: { id } })
  )
}

//新增资源库
export const addResourceLibItem = (params: ResourceLibParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ResourceLib/SaveCreate`, { method: 'POST', data: params })
  )
}

//编辑资源库信息
export const updateResourceLibItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ResourceLib/Modify`, { method: 'POST', data: params })
  )
}

// 删除资源库.?
export const deleteResourceLibItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ResourceLib/Delete`, { method: 'GET', params: { id } })
  )
}

export const restartResourceLib = () => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ResourceLib/RestartService`, { method: 'POST' })
  )
}

export const uploadDrawing = (files: any[], params: any) => {
  const formData = new FormData()
  files.forEach((item) => {
    formData.append('file', item)
  })

  const uploadUrl = `${baseUrl.upload}/Upload/Chart`

  return cyRequest<any[]>(() =>
    request(uploadUrl, {
      method: 'POST',
      params: params,
      data: formData,
      requestType: 'form',
    })
  )
}

//启用/禁用 资源库
export const changeLibStatus = (params: { id: string; status: number }) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ResourceLib/UpdateStatus`, { method: 'POST', data: params })
  )
}
//获取所有资源库列表
export const getResourceLibLists = () => {
  return cyRequest<any>(() =>
    request(`${baseUrl.resource}/ResourceLib/GetPageList`, {
      method: 'POST',
      data: { PageSize: 50, PageIndex: 1 },
    })
  )
}
//创建公司资源库
export const creatCampanyResourceLib = (params: {
  libType: number
  libSource: string
  libName: string
  version: string
  remark: string
}) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.resource}/ResourceLib/SaveCreate`, { method: 'POST', data: params })
  )
}
//获取公司资源库列表
export const getCampanyResourceLibListsWithBackUpInfo = (params: {
  libType: number
  libSource: string
  status: number
}) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.resource}/ResourceLib/GetListWithBackUpInfo`, {
      method: 'GET',
      params: params,
    })
  )
}
//备份公司资源库列表
export const backupResourceLib = (params: { libId: string; isCreateNew: boolean }) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.resource}/ResourceLib/BackUpResource`, { method: 'POST', params: params })
  )
}
//还原公司资源库列表
export const restoreResourceLib = (params: { libId: string; version: string }) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.resource}/ResourceLib/RestoreResource`, { method: 'POST', params: params })
  )
}

//获取图纸存放文件夹
export const getChartPath = (libId: string) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.upload}/Download/GetChartDirPathAsync`, { method: 'GET', params: { libId } })
  )
}

//导出图纸
export const exportChartByPath = (libId: string) => {
  return request(`${baseUrl.upload}/Download/DownloadChartByLibId`, {
    method: 'POST',
    params: { libId },
    responseType: 'blob',
  })
}

//导出公司库资源库
export const exportCompanyLib = (libId: string) => {
  return request(`${baseUrl.resource}/ResourceLib/ExportCompanyResourceByLibId`, {
    method: 'POST',
    params: { libId },
    responseType: 'blob',
  })
}
//公司库资源库-已有库导入
export const existedLibImport = (params: { fromId: string; targetId: string }) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.resource}/CopyResourceLibData/CopyResourceLib`, {
      method: 'POST',
      data: params,
    })
  )
}
//获取所有资源库
export const getAllLib = () => {
  return cyRequest<any>(() =>
    request(`${baseUrl.resource}/ResourceLib/GetItems`, { method: 'GET', params: {} })
  )
}
//模板库导入-物料
export const CopyMaterial = (params: { dataIds: string[]; fromId: string; targetId: string }) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.resource}/CopyResourceLibData/CopyMaterial`, {
      method: 'POST',
      data: params,
    })
  )
}
//模板库导入-组件
export const CopyComponent = (params: { dataIds: string[]; fromId: string; targetId: string }) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.resource}/CopyResourceLibData/CopyComponent`, {
      method: 'POST',
      data: params,
    })
  )
}
//模板库导入-分类
export const CopyCatogery = (params: { dataIds: string[]; fromId: string; targetId: string }) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.resource}/CopyResourceLibData/CopyPoleType`, {
      method: 'POST',
      data: params,
    })
  )
}
//模板库导入-杆型
export const CopyPoleType = (params: { dataIds: string[]; fromId: string; targetId: string }) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.resource}/CopyResourceLibData/CopyModule`, { method: 'POST', data: params })
  )
}
//模板库导入-电缆井
export const CopyCableWell = (params: { dataIds: string[]; fromId: string; targetId: string }) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.resource}/CopyResourceLibData/CopyCableWell`, {
      method: 'POST',
      data: params,
    })
  )
}
//模板库导入-电缆通道
export const CopyCableChannel = (params: {
  dataIds: string[]
  fromId: string
  targetId: string
}) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.resource}/CopyResourceLibData/CopyCableChannel`, {
      method: 'POST',
      data: params,
    })
  )
}
