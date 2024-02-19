import request from '@/utils/request'
import { Moment } from 'moment'
import { baseUrl, cyRequest } from '../common'
import { TableRequestResult } from '../table'

interface CountParams {
  clientCategory: number
  startDate: Moment | String
  endDate: Moment | String
}

// 获取执行公司项目完成率统计
export const getProjectCompleteReport = (params: any) => {
  return cyRequest<TableRequestResult>(() =>
    request(`${baseUrl.project}/Hotfix230827/ProjectCompleteRateReportByCompany`, {
      method: 'GET',
      params,
    })
  )
}

// 获取用户统计数据登录次数
export const getUserLoginCount = (params: CountParams) => {
  return cyRequest<TableRequestResult>(() =>
    request(`${baseUrl.project}/Hotfix230827/GetUserStatisticsOfSignInCount`, {
      method: 'POST',
      data: params,
    })
  )
}

// 获取用户登录时长统计
export const getUserLoginDuration = (params: any) => {
  return cyRequest<TableRequestResult>(() =>
    request(`${baseUrl.project}/Hotfix230827/GetUserStatisticsOfSignInDuration`, {
      method: 'POST',
      data: params,
    })
  )
}

// 获取勘察端上传数据统计
export const getSurveyUploadCount = (params: any) => {
  return cyRequest<TableRequestResult>(() =>
    request(`${baseUrl.project}/Hotfix230827/SurveyUploadStatistics`, {
      method: 'POST',
      data: params,
    })
  )
}

// 获取勘察完成数据统计
export const getSurveyCompleteCount = (params: any) => {
  return cyRequest<TableRequestResult>(() =>
    request(`${baseUrl.project}/Hotfix230827/SurveyCompleteStatistics`, {
      method: 'POST',
      data: params,
    })
  )
}

// 获取设计完成数据统计
export const getDesignCompleteCount = (params: any) => {
  return cyRequest<TableRequestResult>(() =>
    request(`${baseUrl.project}/Hotfix230827/DesignCompleteStatistics`, {
      method: 'POST',
      data: params,
    })
  )
}

//导出用户数据统计
export const exportUserCount = (params: any) => {
  return request(`${baseUrl.project}/Hotfix230827/ExportUserStatistics`, {
    method: 'POST',
    data: params,
    responseType: 'blob',
  })
}

//导出项目数据统计
export const exportProjectCount = () => {
  return request(`${baseUrl.project}/Hotfix230827/ExportProjectStatistics`, {
    method: 'POST',
    responseType: 'blob',
  })
}

//导入云平台统计或批复文件
export const importCloudPlat = (
  files: any[],
  requestSource: 'project',
  url: string,
  stage: any
) => {
  const formData = new FormData()
  files?.forEach((item) => {
    formData.append('file', item)
  })

  const uploadUrl = `${baseUrl[requestSource]}${url}`

  return request(uploadUrl, {
    method: 'POST',
    params: { projectStage: stage },
    data: formData,
    requestType: 'form',
  })
}

//导出云平台统计
export const exportCloudPlat = (params: number | undefined) => {
  return request(`${baseUrl.project}/Hotfix231202/ExportCloudPlat?request=${params}`, {
    method: 'POST',
    responseType: 'blob',
  })
}

//导出批复
export const exportApproved = (params: number | undefined) => {
  return request(`${baseUrl.project}/Hotfix231202/ExportApprovedEngineer`, {
    method: 'POST',
    params: { projectStage: params },
    responseType: 'blob',
  })
}
