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

/**
 *
 * 接口文档 http://10.6.1.36:8025/help/index.html
 * 获取数据初始化侧边栏树形结构
 * @returns
 *
 * */

export const GetMaterialListByProjectIdList = (projectIds: string[]) => {
  return cyRequest<MaterialDataType[]>(() =>
    request(
      `${baseUrl.webGis}/WebGis/GetBatchProjectMaterials
    `,
      {
        method: 'POST',
        data: {
          designType: 0,
          projectIds,
        },
      },
    ),
  );
};

export const GetTrackTimeLine = (projectId: string) => {
  return cyRequest<any>(() =>
    request(
      `${baseUrl.webGis2}/WebGis/GetTrackTimeLine?projectId=${projectId}
    `,
      {
        method: 'POST',
      },
    ),
  );
};
