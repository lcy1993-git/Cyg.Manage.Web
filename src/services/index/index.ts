import request from '@/utils/request'
import { Moment } from 'moment'
import { cyRequest, baseUrl } from '../common'
import { webConfig } from '@/global'

interface ToDoRequestResult {
  awaitKnot: number
  awaitAllot: number
}

interface HomeStatisticCommonParams {
  areaCode?: string
  areaType?: string
}

export interface AreaInfo {
  areaId?: string | undefined
  areaLevel?: string | undefined
  cityId?: string | undefined
}
export interface projectOperationLogParams {
  limit: number
  areaCode: string | undefined
  areaType: string | undefined
}

export interface RefreshDataType {
  content: string
  projectName: string
  projectId: string
  date: Date
  operator: string
  operationCategory: string
}

export type Type = 'pie' | 'bar'

export const getToDoStatistics = (params: HomeStatisticCommonParams) => {
  return cyRequest<ToDoRequestResult>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectPending`, {
      method: 'POST',
      data: { ...params },
    })
  )
}

interface RequestResult {
  id?: string
  key: string
  value: number
}

// 建设类型
export const getProjectBuliding = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectConstructTypes`, {
      method: 'POST',
      data: { ...params },
    })
  )
}

export const getProjectStatus = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectStatus`, {
      method: 'POST',
      data: { ...params },
    })
  )
}

export const getProjectClassify = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectCategorys`, {
      method: 'POST',
      data: { ...params },
    })
  )
}

export const getProjectCategory = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectClassifications`, {
      method: 'POST',
      data: { ...params },
    })
  )
}

export const getProjectStage = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectStages`, {
      method: 'POST',
      data: { ...params },
    })
  )
}

export const getProjectLevel = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectKvLevels`, {
      method: 'POST',
      data: { ...params },
    })
  )
}

export const getProjectNatures = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectNatures`, {
      method: 'POST',
      data: { ...params },
    })
  )
}

export const getBuildType = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectConstructTypes`, {
      method: 'POST',
      data: { ...params },
    })
  )
}

interface GetConsignsParams extends HomeStatisticCommonParams {
  type: string
  startTime: Moment | null | string
  endTime: Moment | null | string
}

export const getConsigns = (params: GetConsignsParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetConsigns`, {
      method: 'POST',
      data: { ...params, limit: 5 },
    })
  )
}

interface GetBurdens extends HomeStatisticCommonParams {
  type: string
}

export const getBurdens = (params: GetBurdens) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetBurdens`, {
      method: 'POST',
      data: { ...params, limit: 5 },
    })
  )
}

export interface MapStatisticsData {
  areaCode: string
  area: string
  engineerQuantity: number
  projectQuantity: number
}

export const getMapStatisticsData = (params: HomeStatisticCommonParams) => {
  return cyRequest<MapStatisticsData[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetMap`, {
      method: 'POST',
      data: { ...params },
    })
  )
}

// 获取甘特图的数据
export const getProjectGanttData = ({
  pageIndex = 1,
  pageSize = 1000,
  areaType = '1',
  sort = {},
  keyWord = '',
  ...params
}) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetGanttChart`, {
      method: 'POST',
      data: {
        areaType,
        pageIndex,
        pageSize,
        sort,
        keyWord,
        ...params,
      },
    })
  )
}

// 获取地图组件的area组件
export const getMapRegisterData = (areaId: string) => {
  return request(`/json/${areaId}.json`, { method: 'GET' })
}

// 获取项目操作log
export const fetchProjectOperationLog = (params: projectOperationLogParams) => {
  return cyRequest<RefreshDataType[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectOperateLog`, {
      method: 'POST',
      data: params,
    })
  )
}

// 轮询验证授权
export const pollingHealth = () => {
  return cyRequest(() =>
    request(`${baseUrl.common}/Authorization/Health`, {
      method: 'GET',
      params: { client: 2 },
    })
  )
}

interface ProjectManageResult {
  awaitProcess: number
  inProgress: number
  delegation: number
  beShared: number
}

// 获取首页项目管理统计栏
export const getProjectManageData = (params: HomeStatisticCommonParams) => {
  return cyRequest<ProjectManageResult>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectQty`, {
      method: 'POST',
      data: { ...params },
    })
  )
}

interface ProjectParams extends HomeStatisticCommonParams {
  category: string
}

interface ProjectResultDataValue {
  qty: number
  yesterdayQty: number
}
interface ProjectResultData {
  key: string
  value: ProjectResultDataValue
}

// 获取首页项目数量
export const getProjectNumberData = (params: ProjectParams) => {
  return cyRequest<ProjectResultData[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectStatusQty`, {
      method: 'POST',
      data: { ...params },
    })
  )
}

// 获取停服公告
export const getStopServerNotice = (params: { serverCode: string; kickOutSeconds: number }) => {
  return request(`${webConfig.commonServer}/api/StopServerNotice/Get`, {
    method: 'POST',
    data: { ...params },
    timeout: 5000,
  })
}

// 获取服务器列表
export const getProductServerList = (params: {
  productCode: string
  category: number
  status: number
  province?: string
}) => {
  // return cyRequest<any>(() =>
  return request(`${webConfig.commonServer}/api/ProductServer/GetList`, {
    method: 'POST',
    data: { ...params },
  })
  // )
}
