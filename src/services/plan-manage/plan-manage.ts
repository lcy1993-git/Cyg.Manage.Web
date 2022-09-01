import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

interface ProjectRealation {
  projectId: string
  elementId: string
  elementType: number
}

/*复制历史网架主线路 **/
export const copyGridHistory = (params: { LineIds: string[] }) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/GridPlan/CopyGridHistoryByLine`, {
      method: 'POST',
      data: params,
    })
  )
}

/*关联项目 **/
export const relationProject = (params: ProjectRealation[]) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/ProjectRelationPlanElement/RelationProject`, {
      method: 'POST',
      data: params,
    })
  )
}

/*获取项目关联规划元素 **/
export const getRelationData = (projectId: string) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/ProjectRelationPlanElement/GetRelationDataByProjectId`, {
      method: 'POST',
      params: { projectId },
    })
  )
}
