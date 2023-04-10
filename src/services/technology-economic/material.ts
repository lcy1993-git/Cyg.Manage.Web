import request from '@/utils/request'
import { cyRequest, baseUrl } from '../common'
import type { SuppliesLibraryData } from '@/pages/technology-economic/supplies-library'

/**
 * 将对象传参formData格式化
 * @param params 传参的对象
 * @returns 对象formData实例
 */
const formData = (params: Object) => {
  const form = new FormData()
  for (const k in params) {
    if (k === 'file') {
      form.append(k, params[k]?.[0])
    } else {
      form.append(k, params[k])
    }
  }
  return form
}
// 修改物料库映射状态
export const materialMappingQuotaModifyStatus = (MaterialId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/MaterialMappingQuotaModifyStatus`, {
      method: 'GET',
      params: { MaterialId },
    })
  )
}

// 修改设计端物料库映射状态
export const materialMappingDesignLibraryModifyStatus = (Id: string) => {
  return cyRequest(() =>
    request(
      `${baseUrl.tecEco1}/MaterialLibrary/MaterialMappingDesignLibraryModifyStatus
`,
      { method: 'GET', params: { Id } }
    )
  )
}

// 新增物料映射
export const addSourceMaterialMappingQuota = (data: SuppliesLibraryData) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/AddSourceMaterialMappingQuota`, {
      method: 'POST',
      data: formData(data),
    })
  )
}
// 新增设计端物料映射
export const addMaterialMappingDesignLibrary = (data: SuppliesLibraryData) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/AddMaterialMappingDesignLibrary`, {
      method: 'POST',
      data,
    })
  )
}

// 查询物料映射库
export const getMaterialMappingQuotaList = (data: {
  mappingType: 1
  sourceMaterialMappingLibraryId: string
  sourceMaterialLibraryId: string
  sourceMaterialLibraryCatalogueId?: string
  pageIndex: number
  pageSize: number
  keyWord?: string
}) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/GetMaterialMappingQuotaList`, {
      method: 'POST',
      data,
    })
  )
}

// 获取映射物料库列表
export const getSourceMaterialMappingLibraryList = (data: {
  pageIndex: number
  pageSize: number
  sort?: {
    propertyName: string
    isAsc: boolean
  }
  keyWord: string
}) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/GetSourceMaterialMappingLibraryList`, {
      method: 'POST',
      data,
    })
  )
}
// 删除
export const deleteMaterialMappingQuota = (materialId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/DeleteMaterialMappingQuota`, {
      method: 'GET',
      params: { materialId },
    })
  )
}
// 删除
export const deleteMaterialMappingDesignLibrary = (Id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/DeleteMaterialMappingDesignLibrary`, {
      method: 'GET',
      params: { Id },
    })
  )
}
// 删除设计端物料映射库-物料项
export const DeleteMaterialMappingDesignItem = (Id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/DeleteMaterialMappingDesignItem`, {
      method: 'GET',
      params: { Id },
    })
  )
}
// 获取设计端资源库下拉列表
export const getResourceLibList = () => {
  return cyRequest<{ id: string; libName: string }[]>(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/GetResourceLibList`, { method: 'GET', params: {} })
  )
}

// 获取设计端映射物料库列表
export const getSourceMaterialMappingDesignLibraryList = (data: {
  pageIndex: number
  pageSize: number
  keyWord: string
}) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/GetSourceMaterialMappingDesignLibraryList`, {
      method: 'POST',
      data,
    })
  )
}

// 继承
export const MaterialMappingInherit = (data: { inheritId: string; byInheritId: string }) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/Inherit`, { method: 'POST', data })
  )
}

// 管理设计端物料映射库项
export const manageMaterialMappingDesignItem = (data: {
  materialMappingDesignItemId: string
  sourceMaterialLibraryId: string
  sourceMaterialItemId: string
}) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/ManageMaterialMappingDesignItem`, {
      method: 'POST',
      data,
    })
  )
}
