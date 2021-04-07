import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface ToDoRequestResult {
  awaitKnot: number;
  awaitAllot: number;
}

interface HomeStatisticCommonParams {
  areaCode?: string
  areaType?: string
}

export const getToDoStatistics = (params: HomeStatisticCommonParams) => {
  return cyRequest<ToDoRequestResult>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectPending`, { method: 'POST', data: {...params}}),
  );
};

interface RequestResult {
  key: string;
  value: number;
}

// 建设类型
export const getProjectBuliding = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectConstructTypes`, { method: 'POST', data: {...params}}),
  );
};

export const getProjectStatus = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectStatus`, { method: 'POST', data: {...params}}),
  );
};

export const getProjectClassify = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectCategorys`, { method: 'POST', data: {...params}}),
  );
};

export const getProjectCategory = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectClassifications`, { method: 'POST', data: {...params}}),
  );
};

export const getProjectStage = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectStages`, { method: 'POST', data: {...params}}),
  );
};

export const getProjectLevel = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectKvLevels`, { method: 'POST', data: {...params}}),
  );
};

export const getProjectNatures = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectNatures`, { method: 'POST', data: {...params}}),
  );
};

export const getBuildType = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectConstructTypes`, { method: 'POST', data: {...params}}),
  );
};

interface GetConsignsParams extends HomeStatisticCommonParams {
  type: string
}

export const getConsigns = (params: GetConsignsParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetConsigns`, {
      method: 'POST',
      data: { ...params, limit: 5 },
    }),
  );
};

export const getBurdens = (type: string | undefined) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetBurdens`, {
      method: 'POST',
      data: { type, limit: 5 },
    }),
  );
};

interface MapStatisticsData {
  area: string;
  engineerQuantity: number;
  projectQuantity: number;
}

export const getMapStatisticsData = (areaId: string) => {
  return cyRequest<MapStatisticsData[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetMap`, {
      method: 'POST',
      data: { province: areaId, type: '1' },
    }),
  );
};

// 获取甘特图的数据
export const getProjectGanttData = ({ pageIndex = 1, pageSize = 15, sort = {}, keyWord = '' }) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetGanttChart`, {
      method: 'POST',
      data: {
        pageIndex,
        pageSize,
        sort,
        keyWord,
      },
    }),
  );
};

// 获取地图组件的area组件
export const getMapRegisterData = (areaId: string) => {
  return request(`/json/${areaId}.json`, { method: 'GET' });
};
