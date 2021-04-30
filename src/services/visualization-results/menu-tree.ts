import request from '@/utils/request';

const webConfig: any = null;

// 获取项目列表
export const getEngineerProjectList = (params: any = {}) => {
  request(
    `http://${webConfig.manageSideInteractiveServiceServerIP}${webConfig.manageSideInteractiveServiceServerPort}/api/WebGis/GetEngineerProjectList`,
    { method: 'POST', data: { ...params } },
  );
};
