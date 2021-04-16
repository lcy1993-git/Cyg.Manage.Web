import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

/**
 * 
 * 接口文档 http://10.6.1.36:8025/help/index.html
 * 获取数据初始化侧边栏树形结构
 * @returns 
 * 
 * */
export const GetEngineerProjectList = () => {
  return cyRequest<any>(() =>
    request(
      `${baseUrl.webGis}/WebGis/GetEngineerProjectList
  `,
      { method: 'POST', data: { kvLevel: -1 } },
    ),
  );
};

