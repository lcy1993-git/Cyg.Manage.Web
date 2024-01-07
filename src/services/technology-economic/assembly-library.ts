import { AssemblyLibraryData } from '@/pages/technology-economic/assembly-library'
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

// 导入设计端模块组合件映射表
export const importAssemblyMaps = (params: any, urlParams: object) => {
  const url = transformUrlParams(
    `${baseUrl.tecEco1}/AssemblyLibrary/ImportDesignAssemblyMaps`,
    urlParams
  )
  return cyRequest(() =>
    request(url, {
      method: 'POST',
      data: formData(params),
    })
  )
}
// 删除
export const deleteAssembById = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/AssemblyLibrary/DeleteAssemblyLibrary`, {
      method: 'GET',
      params: { id },
    })
  )
}

// 新建组合件库
export const addAssemblyLibrary = (data: AssemblyLibraryData, urlParams: object) => {
  const url = transformUrlParams(`${baseUrl.tecEco1}/AssemblyLibrary/AddAssemblyLibrary`, urlParams)
  return cyRequest<any>(() =>
    request(url, {
      method: 'POST',
      data: formData(data),
    })
  )
}
