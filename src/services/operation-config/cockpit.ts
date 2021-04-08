import { cyRequest, baseUrl } from '../common';
import request from '@/utils/request';

//导出配置模块数据

interface exportHomeSetData {
  areaCode: string;
  areaType: number;
  ganttChartLimit: number;
}
export const exportHomeStatisticData = (params: exportHomeSetData) => {
  return request(`${baseUrl.project}/HomeStatistic/Export`, {
    method: 'POST',
    data: params,
    responseType: 'blob',
  });
};

//保存驾驶舱配置
export const saveChartConfig = (config: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/HomeStatistic/SaveChartConfig`, {
      method: 'POST',
      data: { config },
    }),
  );
};

// 获取驾驶舱配置
export const getChartConfig = () => {
  return cyRequest<string>(() =>
    request(`${baseUrl.project}/HomeStatistic/SaveChartConfig`, {
      method: 'GET',
    }),
  );
};
