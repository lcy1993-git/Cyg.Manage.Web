import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

/**
 *
 * 接口文档 http://10.6.1.36:8025/help/index.html
 * 获取数据初始化侧边栏树形结构
 * @returns
 *
 * */

export const GetMaterialListByProjectIdList = (projectIds: string[]) => {
  return cyRequest<any>(() =>
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
