import request from '@/utils/request'
import { Moment } from 'moment'
import { baseUrl, cyRequest } from '../common'
import { TableRequestResult } from '../table'

interface ProjectMonitorParams {
  stage?: number
  startDate: Moment | string | null
  endDate: Moment | string | null
}

// 竣工项目情况统计
export const getProjectSituation = (params: ProjectMonitorParams) => {
  return cyRequest<TableRequestResult>(() =>
    request(`${baseUrl.project}/Hotfix230908/GetCompletionRateByCreationIdentity`, {
      method: 'POST',
      data: params,
    })
  )
}

// 竣工图完成情况
export const getCompleteProject = (params: ProjectMonitorParams) => {
  return cyRequest<TableRequestResult>(() =>
    request(`${baseUrl.project}/Hotfix230908/GetCompletionRateByExecutionIdentity`, {
      method: 'POST',
      data: params,
    })
  )
}

// 云平台应用情况
export const getCloudUseSituation = (params: ProjectMonitorParams) => {
  return cyRequest<TableRequestResult>(() =>
    request(`${baseUrl.project}/Hotfix230908/GetQtyByExecutionIdentity`, {
      method: 'POST',
      data: params,
    })
  )
}

//导出用户数据统计
export const exportProjectMonitor = (params: ProjectMonitorParams) => {
  return request(`${baseUrl.project}/Hotfix230908/Export`, {
    method: 'POST',
    data: params,
    responseType: 'blob',
  })
}
