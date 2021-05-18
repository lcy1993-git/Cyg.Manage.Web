import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

export interface EngineerProjetListFilterParams {
  category?: string[]; //项目分类
  pCategory?: string[]; //项目类别
  stage?: string[]; //项目阶段
  constructType?: string[]; //建设性质
  nature?: string[]; //项目性质
  kvLevel?: string[]; //电压等级
  status?: number[]; //项目状态
  keyWord?: string;
  haveAnnotate?: number;
}

/**
 * 获得的projectList的类型
 */
export interface Properties {
  deadline: Date;
  engineerId: string;
  isExecutor: boolean;
  status: number;
}

export interface ProjectListByAreaType {
  name: string;
  id: string;
  levelCategory: number;
  parentId: string;
  propertys: Properties;
  children?: ProjectListByAreaType[];
}

export interface CommentCount {
  totalQty: number;
  unReadQty: number;
}
/**
 *
 * 接口文档 http://10.6.1.36:8025/help/index.html
 * 获取数据初始化侧边栏树形结构
 * @returns
 *
 * */

export const fetchEngineerProjectListByParamsAndArea = (params: EngineerProjetListFilterParams) => {
  return cyRequest<ProjectListByAreaType[]>(() =>
    request(
      `${baseUrl.projectVisualization}/ProjectVisualization/GetProjectListByArea
    `,
      { method: 'POST', data: params },
    ),
  );
};

export const fetchEngineerProjectListByParamsAndCompany = (
  params: EngineerProjetListFilterParams,
) => {
  return cyRequest<ProjectListByAreaType[]>(() =>
    request(
      `${baseUrl.projectVisualization}/ProjectVisualization/GetProjectListByCompany
    `,
      { method: 'POST', data: params },
    ),
  );
};

export const fetchCommentCountById = (projectId: string) => {
  return cyRequest<CommentCount>(() =>
    request(
      `${baseUrl.comment}/Comment/GetCommentCount
    `,
      { method: 'POST', data: { projectId } },
    ),
  );
};
