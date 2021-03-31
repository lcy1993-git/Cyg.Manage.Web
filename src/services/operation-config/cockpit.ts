import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';
import tokenRequest from '@/utils/request';

//导出配置模块数据

interface exportHomeSetData {
  mapProvince: string;
  ganttChartLimit: number;
}
export const exportHomeStatisticData = (params: exportHomeSetData) => {
  return tokenRequest(`${baseUrl.project}/HomeStatistic/Export`, {
    method: 'POST',
    data: params,
    responseType: 'blob',
  });
};

//保存驾驶舱配置
export const saveChartConfig = (params: JSON) => {
  request(`${baseUrl.project}/HomeStatistic/SaveChartConfig`, {
    method: 'POST',
    data: params,
  });
};
