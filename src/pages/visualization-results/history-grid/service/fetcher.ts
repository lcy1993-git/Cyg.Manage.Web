import { webConfig } from '@/global'
import { baseUrl, cyRequest } from '@/services/common'
import request from 'umi-request'

const historyGridRequest = (url: string, options?: Parameters<typeof request>[1]) => {
  const _url = `${baseUrl.netFrameworkHistory}/${url.startsWith('/') ? url.slice(1) : url}`
  return request(_url, options)
}

/* ----------------------- 地区 ----------------------- */

/** 获取地区数据 */
export const getRegionData = () => {
  // return historyGridRequest('Region/Query', { method: 'POST', data: { topLevel: 2 } })
  const url = `${webConfig.commonServer}/api/Area/GetTreeList`
  return request(url)
}

/* ----------------------- 网架 ----------------------- */

/** 根据项目获取网架数据 */
export const getDataByProjectId = (data: any) => {
  return historyGridRequest('NetFramework/projects', { method: 'POST', data })
}

/** 保存网架数据 */
export const saveData = (data: any) => {
  return historyGridRequest('NetFramework/Save', { method: 'POST', data })
}

/** 初始化网架 */
export const initPreDesign = (projectId: string) => {
  return historyGridRequest(`/NetFramework/Init/${projectId}`, { method: 'POST' })
}

/** 保存历史网架数据 */
export const SaveHistoryData = (data: any) => {
  return historyGridRequest('NetFrameworkHistory/SaveHistory', { method: 'POST', data })
}

/** 清空网架 */
export const clearDataById = (id: string) => {
  return historyGridRequest(`NetFramework/${id}`, { method: 'DELETE' })
}

/** 下载模板 */
export const downloadTemplate = () => {
  return historyGridRequest('NetFramework/Templates', { responseType: 'blob' })
}

/** 导入设备与线缆 */
export const importEquipments = (data: FormData, id: string) => {
  return historyGridRequest(`NetFramework/Import/${id}`, {
    method: 'POST',
    data,
    requestType: 'form',
  })
}

/* ----------------------- 历史网架 ----------------------- */

// 获取历史网架版本
export const getAllGridVersions = (includeDeleted = false) => {
  return cyRequest(() => {
    return request(`${baseUrl.netFrameworkHistory}/NetFrameworkHistory/AllVersions`, {
      method: 'GET',
      params: { includeDeleted },
    })
  })
}
// 通过id获取历史网架版本
export const getHistoriesById = (versionId: string) => {
  return cyRequest(() => {
    return request(`${baseUrl.netFrameworkHistory}/NetFrameworkHistory/Histories/${versionId}`, {
      method: 'GET',
    })
  })
}

// 清屏功能
export const clearData = (id: string) => {
  return historyGridRequest(`NetFramework/Clear/${id}`, { method: 'POST' })
}

// 查询枚举
export const getHistoriesEnums = () => {
  return request(`${baseUrl.netFrameworkHistory}/System/Enums`, {
    method: 'GET',
  })
}

// 删除历史网架版本
export const DeleteGridVersions = (versionId: string, password: string) => {
  // return cyRequest<CommentType[]>(() =>
  return request(`${baseUrl.netFrameworkHistory}/NetFrameworkHistory/Version/Delete/${versionId}`, {
    method: 'POST',
    headers: {
      UserPwd: password,
    },
  })
  // )
}

/** 记录版本 */
export const recordVersionData = (data: { force: boolean; remark: string }) => {
  return historyGridRequest('NetFrameworkHistory/CreateNewVersion', { method: 'POST', data })
}

/** 保存历史网架数据 */
export const saveHistoryData = (data: any) => {
  return historyGridRequest('NetFrameworkHistory/SaveHistory', { method: 'POST', data })
}

/** 下载模板 */
export const downloadHistoryTemplate = () => historyGridRequest('NetFrameworkHistory/Templates')

/** 导入设备与线缆 */
export const importHistoryEquipments = (data: FormData) => {
  return historyGridRequest(`NetFrameworkHistory/Import`, {
    method: 'POST',
    data,
    requestType: 'form',
  })
}

/** 激活编辑中得版本 */
export const activeVersion = (versionId: string) => {
  return historyGridRequest('NetFrameworkHistory/ActiveNetFramework', {
    method: 'PUT',
    params: { versionId },
  })
}

/** 检查版本编辑状态 */
export const checkVersionStatus = (versionId: string) => {
  return historyGridRequest(`NetFrameworkHistory/VersionStatus/${versionId}`)
}
