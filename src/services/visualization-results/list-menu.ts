import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

export interface MaterialDataType {
  description?: string;
  itemNumber?: number;
  materialId?: string;
  name?: string;
  pieceWeight?: number;
  spec?: string;
  state?: string;
  type: string;
  unit?: string;
  unitPrice?: number;
  remark?: string;
  code?: string;
  supplySide?: string;
  children?: MaterialDataType[];
  key?: string;
}

export interface ProjectCommentListItemType {
  id: string;
  createdOn: string;
  status: number;
  engineerId: string;
  projectId: string;
  companyName: string;
  projectName: string;
  deviceType: number;
  layerType: number;
  deviceId: string;
  deviceName: string;
  title: string;
  lastUpdateDate: string;
  createdBy: string;
}

export interface CommentListParams {
  projectIds?: string[];
  engineerId?: string;
  layerTypes?: number[];
  deviceType?: number;
  deviceName?: string;
}

/**
 *
 * 接口文档 http://10.6.1.36:8025/help/index.html
 * 获取数据初始化侧边栏树形结构
 * @returns
 *
 * */

export const fetchMaterialListByProjectIdList = (projectIdList: string[], designType: number) => {
  return cyRequest<MaterialDataType[]>(() =>
    request(
      `${baseUrl.manage}/WebGis/GetBatchProjectMaterials
    `,
      {
        method: 'POST',
        data: {
          designType,
          projectIds: projectIdList,
        },
      },
    ),
  );
};

export const fetchCommentListByParams = (params: CommentListParams) => {
  return cyRequest<ProjectCommentListItemType[]>(() =>
    request(
      `${baseUrl.comment}/Comment/GetProjectCommentList
    `,
      { method: 'POST', data: params },
    ),
  );
};

export const downloadMapPositon = (projectId: string[]) => {
  return request(`${baseUrl.manage}/WebGisDownload/GetProjectFileById`, {
    method: 'POST',
    data: { projectId },
    responseType: "blob"
  });
};
