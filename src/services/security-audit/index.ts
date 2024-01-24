import request from '@/utils/request'
// import { handleSM2Crypto } from '@/utils/utils'
import { Moment } from 'moment'
import { baseUrl, cyRequest } from '../common'

interface Page {
  dateTime: Moment
  auditType: number
  eventType: number | string
  pageIndex: number
  levels: number[]
  pageSize: number
  keyWord: string
  sort: {
    propertyName: string
    isAsc: boolean
  }
}
export interface EventInfo {
  auditType: number
  clientType: number
  clientVersion: string
  clientIp: string
  eventType: number
  eventDetailType: string
  operationDataId: string
  operationDataName: string
  executionUserId: string
  executionUserName: string
  serviceAdress: string
  parameters: string
  executionTime: string
  executionDuration: number
  executionResult: string
  auditLevel: number
}
interface AuditEvent {
  auditType: number
  clientType: number
  clientVersion: string
  clientIp: string
  eventType: number
  eventDetailType: string
  serviceAdress: string
  parameters: string
  executionDuration: number
  executionResult: string
  auditLevel: number
}

export interface SecurityAuditPageItem {
  rate: number
  eventId: number
  auditType: [1, 2]
  auditTypeText: string
  clientType: [1, 2, 3, 4]
  auditLevel: [1, 2, 3, 4]
  auditLevelText: string
  clientTypeText: string
  clientVersion: string
  clientIp: string
  eventType: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  eventTypeText: string
  eventDetailType: string
  serviceAdress: string
  operationDataId: string
  operationDataName: string
  parameters: string
  executionUserId: string
  executionUserName: string
  executionResult: string
  executionDuration: number
  executionTime: Moment
  readOnly: boolean
}

// 密码重置排名
export const getAccountReportForm = () => {
  return cyRequest<[]>(() =>
    request(`${baseUrl.securityAudit}/AccountReportForm/PassWordRestRank`, {
      method: 'POST',
    })
  )
}

// 查询审计记录总条数
export const queryTotalCount = () => {
  return request(`${baseUrl.securityAudit}/SecurityAudit/QueryTotalCount`, {
    method: 'POST',
  })
}

// 通用审计分页查询列表
export const getAuditPageList = (page: Partial<Page>) => {
  return cyRequest<{
    total: number
    pageSize: number
    pageIndex: number
    items: SecurityAuditPageItem[]
  }>(() =>
    request(`${baseUrl.securityAudit}/SecurityAudit/GetPageList`, {
      method: 'POST',
      data: page,
    })
  )
}

// 密码重置列表
export const PassWordRestPageList = (page: Partial<Page>) => {
  return cyRequest<{
    total: number
    pageSize: number
    pageIndex: number
    items: SecurityAuditPageItem[]
  }>(() =>
    request(`${baseUrl.securityAudit}/System/AccountReportForm/PassWordRestPageList`, {
      method: 'POST',
      data: page,
    })
  )
}

// 上传审计日志事件
export const uploadAuditEventInfo = (data: AuditEvent) => {
  return cyRequest<[]>(() =>
    request(`${baseUrl.securityAudit}/SecurityAudit/UploadAuditEventInfo`, {
      method: 'POST',
      data,
    })
  )
}
// 查询登录登出事件列表
export const GetLoginOutEvents = (
  data: Partial<{
    userName: string
    eventId: string
    isLogout: boolean
    queryDate: string
  }>
) => {
  return cyRequest<[]>(() =>
    request(`${baseUrl.securityAudit}/SecurityAudit/GetLoginOutEvents`, {
      method: 'POST',
      data,
    })
  )
}

// （首页）获取审计数量信息-按审计类型分类(系统事件，业务事件)
export const getAuditEventQtyInfo = () => {
  return cyRequest<{
    businessQty: number
    systemQty: number
    total: number
  }>(() =>
    request(`${baseUrl.securityAudit}/SecurityAudit/GetAuditEventQtyInfo`, {
      method: 'POST',
    })
  )
}

export interface EventChartInfo {
  auditType: 1 | 2
  eventType: number
  hour: number
  endTime: string
}

// （首页）获取日志趋势图表数据(从当前日期往前推n个小时开始统计)
export const getAuditEventChartInfo = (params?: Partial<EventChartInfo>) => {
  return cyRequest<[]>(() =>
    request(`${baseUrl.securityAudit}/SecurityAudit/GetAuditEventChartInfo`, {
      method: 'GET',
      params,
    })
  )
}

// （首页） 获取安全事件分类数量统计(登录，退出登录,...)
export const getAuditEventCategoryQty = () => {
  return cyRequest<[]>(() =>
    request(`${baseUrl.securityAudit}/SecurityAudit/GetAuditEventCategoryQty`, {
      method: 'GET',
    })
  )
}

// 获取事件数量(按照客户端类型分类(管理端，勘察端，设计端)
export const getQtyByClientType = (params?: {
  searchDate?: Moment | string
  auditType?: number
  eventType?: number
}) => {
  return cyRequest<[]>(() =>
    request(`${baseUrl.securityAudit}/SecurityAudit/GetQtyByClientType`, {
      method: 'GET',
      params,
    })
  )
}

// 获取事件列表
export const GetEventsByNameOrId = (
  data: Partial<{
    userName: string
    eventId: string
    date: Moment
    auditTypes: number[]
    eventTypes: number[]
    asc: boolean
  }>
) => {
  return cyRequest<[]>(() =>
    request(`${baseUrl.securityAudit}/SecurityAudit/GetEvents`, {
      method: 'POST',
      data,
    })
  )
}

// 获取登录登出趋势
export const GetLoinoutTrends = (
  data: Partial<{
    isLogout: boolean
    queryDate: string
  }>
) => {
  return cyRequest<[]>(() =>
    request(`${baseUrl.securityAudit}/SecurityAudit/GetLoinoutTrends`, {
      method: 'POST',
      data,
    })
  )
}
// 密码重置排名
export const PassWordRestRank = () => {
  return cyRequest<[]>(() =>
    request(`${baseUrl.securityAudit}/System/AccountReportForm/PassWordRestRank`, {
      method: 'POST',
    })
  )
}

// 所有端口文件传输统计
export const FileTransferStatisticsAllClient = () => {
  return cyRequest<[]>(() =>
    request(`${baseUrl.securityAudit}/System/ServerReportForm/FileTransferStatisticsAllClient`, {
      method: 'POST',
    })
  )
}

// 所有端口连接超时统计
export const ConnectTimeoutAllClient = () => {
  return cyRequest<[]>(() =>
    request(`${baseUrl.securityAudit}/System/ServerReportForm/ConnectTimeoutAllClient`, {
      method: 'POST',
    })
  )
}

// 所有端口项目修改统计
export const ProjectModifyAllClient = () => {
  return cyRequest<[]>(() =>
    request(`${baseUrl.securityAudit}/Business/ProjectReportForm/ProjectModifyAllClient`, {
      method: 'POST',
    })
  )
}

// 所有端口项目流程变化统计
export const ProjectProcessChangeAllClient = () => {
  return cyRequest<[]>(() =>
    request(`${baseUrl.securityAudit}/Business/ProjectReportForm/ProjectProcessChangeAllClient`, {
      method: 'POST',
    })
  )
}

// 所有端口项目变动统计
export const ProjectChangeAllClient = () => {
  return cyRequest<[]>(() =>
    request(`${baseUrl.securityAudit}/Business/ProjectReportForm/ProjectChangeAllClient`, {
      method: 'POST',
    })
  )
}

// 所有端口资源库变动统计统计
export const ResourceLibChangeAllClient = () => {
  return cyRequest<[]>(() =>
    request(`${baseUrl.securityAudit}/Business/ResourceLibtReportForm/ResourceLibChangeAllClient`, {
      method: 'POST',
    })
  )
}

// 上传审计日志事件
export const UploadAuditEventInfo = (data: Partial<EventInfo>[]) => {
  return request(`${baseUrl.securityAudit}/SecurityAudit/UploadAuditEventInfo`, {
    method: 'POST',
    data,
  })
}
// 上传审计日志事件不带token
export const UploadAuditEventInfoWithoutToken = (data: {
  data: Partial<EventInfo>[]
  X_Reqid: string
  X_TimeStamp: number
}) => {
  return request(`${baseUrl.securityAudit}/SecurityAudit/UploadAuditEventInfoWithoutToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  })
}

// 账号状态修改量（用于账号状态修改图表)
export const GetAccountChangeEventCount = (date?: string) => {
  return cyRequest<[]>(() =>
    request(
      `${baseUrl.securityAudit}/SecurityAudit/GetAccountChangeEventCount?dates=${date || ''}`,
      {
        method: 'get',
      }
    )
  )
}
