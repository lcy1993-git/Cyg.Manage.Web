import { baseUrl, cyRequest } from '@/services/common'
import request from 'umi-request'
import { head } from 'lodash'
import { CommentType } from '@/services/visualization-results/side-popup'

const historyGridRequest = (url: string, options?: Parameters<typeof request>[1]) => {
  return request(
    `${baseUrl.netFrameworkHistory}/${url.startsWith('/') ? url.slice(1) : url}`,
    options
  )
}

/* ----------------------- 地区 ----------------------- */

/** 获取地区数据 */
export const getRegionData = () => historyGridRequest('Region/Query')

/* ----------------------- 网架 ----------------------- */

/** 根据项目获取网架数据 */
export const getDataByProjectId = (id: string) => historyGridRequest(`NetFramework/project/${id}`)

/** 保存网架数据 */
export const saveData = (data: any) => {
  return historyGridRequest('NetFramework/Save', { method: 'POST', data })
}

/** 清空网架 */
export const clearDataById = (id: string) => {
  return historyGridRequest(`NetFramework/${id}`, { method: 'DELETE' })
}

/** 下载模板 */
export const downloadTemplate = () => historyGridRequest('NetFramework/Templates')

/** 导入设备与线缆 */
export const importEquipments = (data: FormData, id: string) => {
  return historyGridRequest(`NetFramework/Import/${id}`, {
    method: 'POST',
    data,
    responseType: 'formData',
  })
}

/* ----------------------- 历史网架 ----------------------- */

// 获取历史网架版本
export const getAllGridVersions = (includeDeleted = false) => {
  return request(`${baseUrl.netFrameworkHistory}/NetFrameworkHistory/AllVersions`, {
    method: 'GET',
    params: { includeDeleted },
  })
}
// 通过id获取历史网架版本
export const getHistoriesById = (versionId: string) => {
  return request(`${baseUrl.netFrameworkHistory}/NetFrameworkHistory/Histories/${versionId}`, {
    method: 'GET',
  })
}

// 删除历史网架版本
export const DeleteGridVersions = (versionId: string, password: string) => {
  return cyRequest<CommentType[]>(() =>
    request(`${baseUrl.netFrameworkHistory}/NetFrameworkHistory/Version/${versionId}`, {
      method: 'DELETE',
      headers: {
        UserPwd: password,
      },
    })
  )
}

/** 记录版本 */
export const recordVersion = () => {
  return historyGridRequest('NetFrameworkHistory/CreateNewVersion')
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
    responseType: 'formData',
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
