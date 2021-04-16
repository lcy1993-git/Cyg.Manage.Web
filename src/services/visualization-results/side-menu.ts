import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

export interface EngineerProjetListFilterParams {
  category?: number; //项目分类
  pCategory?: number; //项目类别
  stage?: number; //项目阶段
  constructType?: number; //建设性质
  nature?: number; //项目性质
  kvLevel?: number; //电压等级
  createdOn?: string; //建设时间
  modifyDate?: string; //更新时间
  statuss?: number[]; //项目状态
  keyWord?: string;
}

/**
 *
 * 接口文档 http://10.6.1.36:8025/help/index.html
 * 获取数据初始化侧边栏树形结构
 * @returns
 *
 * */
export const GetEngineerProjectList = (id?: number) => {
  return cyRequest<any>(() =>
    request(
      `${baseUrl.webGis}/WebGis/GetEngineerProjectList
  `,
      { method: 'POST', data: { kvLevel: -1 } },
    ),
  );
};

export const GetEngineerProjectListByParams = (params: EngineerProjetListFilterParams) => {
  return cyRequest<any>(() =>
    request(
      `${baseUrl.webGis}/WebGis/GetEngineerProjectList
    `,
      { method: 'POST', data: params },
    ),
  );
};
