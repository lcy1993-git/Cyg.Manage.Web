import request from '@/utils/request'
import { Moment } from 'moment'
import { cyRequest, baseUrl } from '../common'
import { TableRequestResult } from '../table'

interface ProjectEntrustTableParams extends TableRequestResult {
  keyWord?: string
  category?: number[]
  pCategory?: number[]
  stage?: number[]
  majorCategory?: number[]
  constructType?: number[]
  pType?: number[]
  reformAim: number[]
  nature?: number[]
  kvLevel?: number[]
  areaType?: number | string
  areaId?: string
  pageIndex: number
  pageSize: number
  startTime: Moment
  endTime: Moment
}

// 获取列表
export const getEntrustProjectList = (params: ProjectEntrustTableParams) => {
  return cyRequest<TableRequestResult>(() =>
    request(`${baseUrl.project}/ProjectList/GetAgents`, { method: 'POST', data: params })
  )
}

//获取项目
export const receiveProject = (projectIds: string[]) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/PorjectAgent/Receive`, {
      method: 'POST',
      data: { projectIds },
    })
  )
}
