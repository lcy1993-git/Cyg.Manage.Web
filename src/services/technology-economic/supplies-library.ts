import type { SuppliesLibraryData } from '@/pages/technology-economic/supplies-library'
import type { QueryData } from '@/services/technology-economic/usual-quota-table'
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
    if (k === 'file') {
      form.append(k, params[k]?.[0])
    } else {
      form.append(k, params[k])
    }
  }
  return form
}
// 查询物料库树
export const getMaterialLibraryTreeById = (MaterialId: string) => {
  return cyRequest<[]>(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/GetMaterialLibraryTreeById`, {
      method: 'GET',
      params: { MaterialId },
    })
  )
}
// 修改物料库状态
export const modifyMaterialLibraryStatus = (MaterialId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/ModifyStatus`, {
      method: 'GET',
      params: { MaterialId },
    })
  )
}
// 删除
export const deleteMaterialLibraryById = (MaterialId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/DeleteMaterialLibraryById`, {
      method: 'GET',
      params: { MaterialId },
    })
  )
}

// 查询物料库列表
export const getMaterialLibraryList = (data: Partial<QueryData>) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/GetMaterialLibraryList`, { method: 'POST', data })
  )
}

// 查询物料库列表(物料映射库用)
export const getMaterialLibraryAllList = () => {
  return cyRequest<any>(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/GetMaterialLibraryAllList`, { method: 'GET' })
  )
}
// 查询物料库列表没有使用的(物料映射库用)
export const GetMaterialLibraryAllListNoUsed = () => {
  return cyRequest<any>(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/GetMaterialLibraryAllListNoUsed`, { method: 'GET' })
  )
}

// 新增物料库
export const addMaterialLibrary = (data: SuppliesLibraryData, urlParams: object) => {
  const url = transformUrlParams(`${baseUrl.tecEco1}/MaterialLibrary/AddMaterialLibrary`, urlParams)
  return cyRequest<any>(() =>
    request(url, {
      method: 'POST',
      data: formData(data),
    })
  )
}
