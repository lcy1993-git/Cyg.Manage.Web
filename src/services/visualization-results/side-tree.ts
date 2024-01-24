import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

export interface EngineerProjetListFilterParams {
  category?: string[] //项目分类
  pCategory?: string[] //项目类别
  stage?: string[] //项目阶段
  constructType?: string[] //建设性质
  nature?: string[] //项目性质
  kvLevel?: any[] //电压等级
  status?: number[] //项目状态
  keyWord?: string
  haveAnnotate?: number
}

/**
 * 获得的projectList的类型
 */
export interface Properties {
  endTime: Date
  engineerId: string
  isExecutor: boolean
  status: number
}

export interface ProjectListByAreaType {
  name: string
  id: string
  levelCategory: number
  parentId: string
  propertys: Properties
  children?: ProjectListByAreaType[]
}

export interface CommentCount {
  totalQty: number
  unReadQty: number
}
/**
 *
 * 接口文档 http://10.6.1.36:8025/help/index.html
 * 获取数据初始化侧边栏树形结构
 * @returns
 *
 * */

export const fetchAreaEngineerProjectListByParams = (params: EngineerProjetListFilterParams) => {
  return cyRequest<ProjectListByAreaType[]>(() =>
    request(`${baseUrl.project}/ProjectVisualization/GetProjectListByArea`, {
      method: 'POST',
      data: params,
    })
  )
}

export const fetchCompanyEngineerProjectListByParams = (params: EngineerProjetListFilterParams) => {
  return cyRequest<ProjectListByAreaType[]>(() =>
    request(
      `${baseUrl.project}/ProjectVisualization/GetProjectListByCompany
    `,
      { method: 'POST', data: params }
    )
  )
}

export const fetchCommentCountById = (projectId: string) => {
  return cyRequest<CommentCount>(() =>
    request(
      `${baseUrl.comment}/Comment/GetCommentCount
    `,
      { method: 'POST', data: { projectId } }
    )
  )
}

// 下载多媒体文件
export const downloadMediaZipFile = (projectIds: string[]) => {
  return request(`${baseUrl.upload}/Download/DownloadMediaZipFile`, {
    method: 'POST',
    data: {
      projectIds,
    },
    responseType: 'blob',
  })
}

// 迁移数据
export const dataMigrate = (
  sourceProjectId: string,
  targetProjectId: string,
  surveyGisData: any,
  planGisData: any
) => {
  return request(`${baseUrl.comment}/Project/Migrate`, {
    method: 'POST',
    data: {
      sourceProjectId,
      targetProjectId,
      surveyGisData,
      planGisData,
    },
  })
}
// 迁移数据
export const copyMember = (sourceProjectId: string, targetProjectId: string) => {
  return request(`${baseUrl.comment}/Project/SyncProjectStateAllot`, {
    method: 'GET',
    params: {
      sourceProjectId,
      targetProjectId,
    },
  })
}
