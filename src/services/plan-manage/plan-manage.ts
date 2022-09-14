import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

interface ProjectRealation {
  projectId: string
  elementId: string
  elementType: number
}

/*复制历史网架主线路 **/
export const copyGridHistory = (LineIds: string[]) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/GridPlan/CopyGridHistoryByLine`, {
      method: 'POST',
      data: LineIds,
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

interface ArchiveParams {
  lineId: string | undefined
  layerType: number | undefined
  projectId: string
}

/*项目归档 **/
export const archiveToHistoryGrid = (params: ArchiveParams) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/GridConstruction/ArchiveToHistoryGrid`, {
      method: 'POST',
      data: params,
    })
  )
}
