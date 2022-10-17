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

//获取项目数量
export const getProjectStatistics = () => {
  return cyRequest(() =>
    request(`${baseUrl.monitor}/ProjectStatistic/GetTotalQty`, { method: 'Get' })
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
  return cyRequest(() => request(`${baseUrl.monitor}/UserStatistic/ExportUsers`, { method: 'GET' }))
}
