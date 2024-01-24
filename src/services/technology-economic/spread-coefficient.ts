import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

interface ImportProject {
  // engineeringTemplateId: string
  files: File
}
interface catalogueParams {
  // name: string
  // enabled: boolean
  // publishedBy: string
  // publishDate: string
  // remark: string
  // id?: string
}
/**
 * 将对象传参formData格式化
 * @param params 传参的对象
 * @returns 对象formData实例
 */
const formData = (params: Object) => {
  const form = new FormData()
  for (let k in params) {
    if (k === 'file' || k === 'files') {
      form.append(k, params[k]?.[0])
    } else {
      form.append(k, params[k])
    }
  }
  return form
}
// 获取价差目录列表
export const getAllDefaultPriceDifferenceTemplates = () => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.tecEco1}/PriceDifference/GetAllDefaultPriceDifferenceTemplates`, {
      method: 'POST',
      data: {},
    })
  )
}
// 创建价差目录
export const createCatalogue = (params: catalogueParams) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.tecEco1}/PriceDifference/CreateCatalogue`, {
      method: 'POST',
      data: params,
    })
  )
}
// 更新价差目录
export const updateCatalogue = (params: catalogueParams) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.tecEco1}/PriceDifference/UpdateCatalogue`, {
      method: 'POST',
      data: params,
    })
  )
}
// 上传价差模板文件
export const uploadTemplates = (data: ImportProject) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/PriceDifference/UploadTemplates`, {
      method: 'POST',
      data: formData(data),
      requestType: 'form',
    })
  )
}
// 导入默认模板数据
export const importDefaultTemplateData = (data: ImportProject, urlParams: object) => {
  const url = `${baseUrl.tecEco1}/PriceDifference/ImportDefaultTemplateData`

  return cyRequest(() =>
    request(url, {
      method: 'POST',
      params: urlParams,
      data: formData(data),
      requestType: 'form',
    })
  )
}
//下载模板
export const downLoadTemplate = (params: any) => {
  return request(`${baseUrl.tecEco1}/PriceDifference/DownloadTemplate`, {
    method: 'GET',
    params,
    responseType: 'blob',
  })
}
// 查看默认模板数据
export const defaultPriceDifferenceTemplate = (id: any) => {
  return request(`${baseUrl.tecEco1}/PriceDifference/DefaultPriceDifferenceTemplate/${id}`, {
    method: 'GET',
  })
}
// 获取工程的价差模板文件名和地区名
export const getTemplateNameAndAreaOfEngineering = (EngineeringId: any) => {
  return request(
    `${baseUrl.tecEco1}/PriceDifference/GetTemplateNameAndAreaOfEngineering/${EngineeringId}`,
    {
      method: 'GET',
    }
  )
}
// 获取目录详情列表
export const getAllTemplateItemsById = (id: any) => {
  return request(`${baseUrl.tecEco1}/PriceDifference/GetAllTemplateItems/${id}`, {
    method: 'GET',
  })
}
//下载模板Excel
export const downLoadTemplateExcel = (params: any) => {
  return request(`${baseUrl.tecEco1}/PriceDifference/DownloadTemplate`, {
    method: 'GET',
    params,
    responseType: 'blob',
  })
}
// 获取所有调整文件列表
export const getAdjustmentFiles = () => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.tecEco1}/PriceDifference/GetAllAdjustmentFiles`, {
      method: 'POST',
      params: {},
    })
  )
}
// 获取已启用调整文件列表
export const getEnabledAdjustmentFiles = () => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.tecEco1}/PriceDifference/GetEnabledAdjustmentFiles`, {
      method: 'POST',
      params: {},
    })
  )
}
// 创建调整文件
export const createAdjustmentFile = (params: catalogueParams) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.tecEco1}/PriceDifference/CreateAdjustmentFile`, {
      method: 'POST',
      data: params,
      // data: formData(params),
    })
  )
}
// 添加价差地区
export const addArea = (params: catalogueParams, urlParams: any) => {
  const url = `${baseUrl.tecEco1}/PriceDifference/AddArea`
  return cyRequest<any[]>(() =>
    request(url, {
      method: 'POST',
      params: urlParams,
      data: formData(params),
      requestType: 'form',
    })
  )
}
// 编辑价差地区
export const updateArea = (params: catalogueParams, urlParams: object) => {
  const url = `${baseUrl.tecEco1}/PriceDifference/UpdateArea`
  return cyRequest<any[]>(() =>
    request(url, {
      method: 'POST',
      params: urlParams,
      data: formData(params),
      requestType: 'form',
    })
  )
}
// 更新调整文件
export const updateAdjustmentFile = (params: catalogueParams) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.tecEco1}/PriceDifference/UpdateAdjustmentFile`, {
      method: 'POST',
      data: params,
    })
  )
}
// 启用或则停用目录
export const setDefaultTemplateStatus = (id: any, status: any) => {
  return request(`${baseUrl.tecEco1}/PriceDifference/SetDefaultTemplateStatus/${id}/${status}`, {
    method: 'POST',
  })
}
// 启用或则停用调整文件
export const setAdjustmentFileStatus = (id: any, status: any) => {
  return request(`${baseUrl.tecEco1}/PriceDifference/SetAdjustmentFileStatus/${id}/${status}`, {
    method: 'POST',
  })
}
// 删除目录
export const deleteTemplate = (id: any) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/PriceDifference/DeleteTemplate`, { method: 'POST', data: id })
  )
}
// 删除目录详情
export const deleteTemplateItem = (params: any) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/PriceDifference/DeleteTemplateItem`, {
      method: 'POST',
      data: params,
    })
  )
}
// 上传技经文件
export const technicalEconomyFile = (securityKey: string, data: any) => {
  return cyRequest(() =>
    request(`${baseUrl.upload}/Upload/TechnicalEconomyFile`, {
      method: 'POST',
      params: { securityKey },
      data: formData(data),
      requestType: 'form',
    })
  )
}
// 删除调整文件
export const deleteAdjustmentFile = (id: any) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/PriceDifference/DeleteAdjustmentFile?id=${id}`, {
      method: 'POST',
      data: {},
    })
  )
}
