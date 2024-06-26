/**
 * 站房设计接口
 */
import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

export enum StationHouseEnum {
  '开关站' = 1,
  '环网室',
  '配电站',
}

// 导入站房方案
export const importStationScheme = (params: any) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/StationScheme/ImportStationScheme`, {
      method: 'POST',
      data: params,
    })
  )
}

// 查询方案信息列表
export const queryStationSchemePage = (params: any) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/StationScheme/QueryStationSchemePage`, {
      method: 'POST',
      data: params,
    })
  )
}

//获取方案间隔限制
export const getStationSchemeIntervalLimits = (stationSchemeCode: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/StationScheme/GetStationSchemeIntervalLimits`, {
      method: 'GET',
      params: { stationSchemeCode },
    })
  )
}

//获取方案间隔模板数据
export const getStationSchemeIntervalData = (stationSchemeCode: string) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.resource}/StationScheme/GetStationSchemeIntervalData`, {
      method: 'GET',
      params: { stationSchemeCode },
    })
  )
}

// 查询站房模版图纸分页列表
export const queryStationTemplateChartPage = (params: any) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/StationScheme/QueryStationTemplateChartPage`, {
      method: 'POST',
      data: params,
    })
  )
}

// 导入方案或模板图纸
export const importSchemeOrChartTemp = (files: any[], url: string) => {
  const formData = new FormData()
  files.forEach((item) => {
    formData.append('file', item)
  })

  const uploadUrl = `${baseUrl.resource}${url}`
  return request(uploadUrl, {
    method: 'POST',
    data: formData,
    requestType: 'form',
  })
}
