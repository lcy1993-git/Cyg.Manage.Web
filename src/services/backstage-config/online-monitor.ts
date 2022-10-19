import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

interface UserStatisticParams {
  clientCategory: number
  year?: number
  month?: number
  day?: number
}

//获取用户数量
export const getUserStatistics = () => {
  return cyRequest<any>(() =>
    request(`http://www.monitor.dev2.com/api/UserStatistic/GetUserQty`, { method: 'Get' })
  )
}

//获取各端在线用户数量折线图
export const getOnlineUserQty = (params: UserStatisticParams) => {
  return cyRequest<any>(() =>
    request(`http://www.monitor.dev2.com/api/UserStatistic/GetOnlineUserQtyByPeriod`, {
      method: 'POST',
      data: params,
    })
  )
}

//导出用户账号信息
export const exportUserStatistics = () => {
  return request(`http://www.monitor.dev2.com/api/UserStatistic/ExportUsers`, {
    method: 'GET',
    responseType: 'blob',
  })
}

//获取项目数量
export const getProjectStatistics = (params: { areaCode: string }) => {
  return cyRequest<any>(() =>
    request(`http://www.monitor.dev2.com/api/ProjectStatistic/GetTotalQty`, {
      method: 'POST',
      data: params,
    })
  )
}

//按区域获取项目数量
export const getQtyByArea = (params: { areaCode: string }) => {
  return cyRequest<any>(() =>
    request(`http://www.monitor.dev2.com/api/ProjectStatistic/GetQtyByArea`, {
      method: 'POST',
      data: params,
    })
  )
}

//按项目状态获取数量
export const getQtyByState = (params: { areaCode: string }) => {
  return cyRequest(() =>
    request(`http://www.monitor.dev2.com/api/ProjectStatistic/GetQtyByState`, {
      method: 'POST',
      data: params,
    })
  )
}

//导出项目统计
export const exportProjectInfo = (params: { areaCode: string }) => {
  return request(`http://www.monitor.dev2.com/api/ProjectStatistic/Export`, {
    method: 'POST',
    data: params,
  })
}
