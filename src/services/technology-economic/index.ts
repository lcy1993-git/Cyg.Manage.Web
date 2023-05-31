import request, { transformUrlParams } from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

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

// ***定额库***
export interface CreateQuotaLibrary {
  // materialMachineLibraryId: string
  // name: string
  // quotaScope: 1 | 2
  // publishDate: string
  // publishOrg: string
  // year: number | string
  // industryType: 1 | 2 | 3
  // majorType: 1 | 2
  // remark: string
  // enabled: boolean
  file: File
}

// 定额库列表查询

export const queryQuotaLibraryPager = (params: GetPage) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibrary/QueryQuotaLibraryPager`, {
      method: 'POST',
      data: params,
    })
  )
}

// 定额库目录列表

export const queryQuotaLibraryCatalogList = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibrary/QueryQuotaLibraryCatalogList`, {
      method: 'GET',
      params: { id },
    })
  )
}

// 创建定额库
export const createQuotaLibrary = (params: CreateQuotaLibrary, urlParams: object) => {
  let url = transformUrlParams(`${baseUrl.tecEco}/QuotaLibrary/CreateQuotaLibrary`, urlParams)
  return cyRequest(() =>
    request(url, {
      method: 'POST',
      data: formData(params),
    })
  )
}

// 删除定额库
export const deleteQuotaLibrary = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibrary/DeleteQuotaLibrary`, { method: 'GET', params: { id } })
  )
}

// 设置定额库状态
export const setQuotaLibraryStatus = (id: string, enabled: boolean) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibrary/SetQuotaLibraryStatus`, {
      method: 'GET',
      params: { id, enabled },
    })
  )
}

// ***人材机库***
interface GetPage {
  pageIndex: number
  pageSize: number
  sort?: {
    propertyName?: string
    isAsc?: boolean
  }
  keyWord?: string
}

interface CreateMaterialMachineLibrary {
  // name: string
  // publishDate: string
  // publishOrg: string
  // year: number
  // IndustryType: 1 | 2 | 3
  // remark: string
  // enabled: boolean
  file: File
}

// 分页列表
export const queryMaterialMachineLibraryPager = (data: GetPage) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/MaterialMachineLibrary/QueryMaterialMachineLibraryPager`, {
      method: 'POST',
      data,
    })
  )
}

// 创建人材机库
export const createMaterialMachineLibrary = (
  data: CreateMaterialMachineLibrary,
  urlParams: object
) => {
  let url = transformUrlParams(
    `${baseUrl.tecEco}/MaterialMachineLibrary/CreateMaterialMachineLibrary`,
    urlParams
  )
  return cyRequest(() =>
    request(url, {
      method: 'POST',
      data: formData(data),
    })
  )
}

// 删除人材机库
export const deleteMaterialMachineLibrary = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/MaterialMachineLibrary/DeleteMaterialMachineLibrary`, {
      method: 'GET',
      params: { id },
    })
  )
}

// 人材机库下目录列表(平铺数据)
export const queryMaterialMachineLibraryCatalogList = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/MaterialMachineLibrary/queryMaterialMachineLibraryCatalogList`, {
      method: 'GET',
      params: { id },
    })
  )
}

// 人材机项分页列表
export const queryMaterialMachineItemPager = (data: GetPage) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/MaterialMachineLibraryCatalog/QueryMaterialMachineItemPager`, {
      method: 'POST',
      data,
    })
  )
}

//设置人材机库状态
export const setMaterialMachineLibraryStatus = (id: string, enabled: boolean) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/MaterialMachineLibrary/SetMaterialMachineLibraryStatus`, {
      method: 'GET',
      params: { id, enabled },
    })
  )
}

// ***章节说明***
interface SaveQuotaLibraryCatalogDescription {
  id: string
  chapterDescription: string
}

// 获取定额库目录章节说明
export const getQuotaLibraryCatalogDescription = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibraryCatalog/GetQuotaLibraryCatalogDescription`, {
      method: 'POST',
      data: { id },
    })
  )
}

// 上传章节说明
export const UploadChapterDescriptionFiles = (data: {
  files: any
  quotaLibraryCatalogId: string
}) => {
  return cyRequest(() =>
    request(
      `${baseUrl.tecEco}/QuotaLibraryCatalog/UploadChapterDescriptionFiles/${data.quotaLibraryCatalogId}`,
      { method: 'POST', data: formData(data) }
    )
  )
}
// 上传定额说明doc文档
export const UploadChapterDescriptionFile = (data: {
  file: any
  quotaLibraryCatalogId: string
}) => {
  return cyRequest(() =>
    request(
      `${baseUrl.tecEco}//QuotaLibraryCatalog/UploadChapterDescriptionFile/${data.quotaLibraryCatalogId}`,
      { method: 'POST', data: formData(data) }
    )
  )
}
// 保存定额库目录章节说明
export const saveQuotaLibraryCatalogDescription = (data: SaveQuotaLibraryCatalogDescription) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibraryCatalog/SaveQuotaLibraryCatalogDescription`, {
      method: 'POST',
      data,
    })
  )
}

// ***枚举相关***

// 行业类别枚举
export const getIndustryTypeEnums = () => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/CommonEnum/GetIndustryTypeEnums`, { method: 'GET' })
  )
}

// 适用专业枚举
export const getMajorTypeEnums = () => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/CommonEnum/GetMajorTypeEnums`, { method: 'GET' })
  )
}

// 定额范围枚举
export const getQuotaScopeEnums = () => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/CommonEnum/GetQuotaScopeEnums`, { method: 'GET' })
  )
}

// 获取所有枚举值
export const getTechnicalEconomyEnums = () => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/System/GetTechnicalEconomyEnums`, { method: 'POST', data: null })
  )
}
