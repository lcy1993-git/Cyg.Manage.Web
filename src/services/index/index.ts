import request from '@/utils/request';
import { Moment } from 'moment';
import { cyRequest, baseUrl } from '../common';

interface ToDoRequestResult {
  awaitKnot: number;
  awaitAllot: number;
}

interface HomeStatisticCommonParams {
  areaCode?: string;
  areaType?: string;
}

export interface AreaInfo {
  areaId?: string | undefined;
  areaLevel?: string | undefined;
}
export interface projectOperationLogParams {
  limit: number;
  areaCode: string | undefined;
  areaType: string | undefined;
}

export interface RefreshDataType {
  content: string;
  projectName: string;
  projectId: string;
  date: Date;
  operator: string;
  operationCategory: string;
}

export type Type = 'pie' | 'bar';

export const getToDoStatistics = (params: HomeStatisticCommonParams) => {
  return cyRequest<ToDoRequestResult>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectPending`, {
      method: 'POST',
      data: { ...params },
    }),
  );
};

interface RequestResult {
  id?: string;
  key: string;
  value: number;
}

// 建设类型
export const getProjectBuliding = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectConstructTypes`, {
      method: 'POST',
      data: { ...params },
    }),
  );
};

export const getProjectStatus = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectStatus`, {
      method: 'POST',
      data: { ...params },
    }),
  );
};

export const getProjectClassify = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectCategorys`, {
      method: 'POST',
      data: { ...params },
    }),
  );
};

export const getProjectCategory = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectClassifications`, {
      method: 'POST',
      data: { ...params },
    }),
  );
};

export const getProjectStage = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectStages`, {
      method: 'POST',
      data: { ...params },
    }),
  );
};

export const getProjectLevel = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectKvLevels`, {
      method: 'POST',
      data: { ...params },
    }),
  );
};

export const getProjectNatures = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectNatures`, {
      method: 'POST',
      data: { ...params },
    }),
  );
};

export const getBuildType = (params: HomeStatisticCommonParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectConstructTypes`, {
      method: 'POST',
      data: { ...params },
    }),
  );
};

interface GetConsignsParams extends HomeStatisticCommonParams {
  type: string;
  startTime: Moment | null | string;
  endTime: Moment | null | string;
}

export const getConsigns = (params: GetConsignsParams) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetConsigns`, {
      method: 'POST',
      data: { ...params, limit: 5 },
    }),
  );
};

interface GetBurdens extends HomeStatisticCommonParams {
  type: string;
}

export const getBurdens = (params: GetBurdens) => {
  return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetBurdens`, {
      method: 'POST',
      data: { ...params, limit: 5 },
    }),
  );
};

export interface MapStatisticsData {
  areaCode: string;
  area: string;
  engineerQuantity: number;
  projectQuantity: number;
}

export const getMapStatisticsData = (params: HomeStatisticCommonParams) => {
  return cyRequest<MapStatisticsData[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetMap`, {
      method: 'POST',
      data: { ...params },
    }),
  );
};

// 获取甘特图的数据
export const getProjectGanttData = ({
  pageIndex = 1,
  pageSize = 1000,
  areaType = '1',
  sort = {},
  keyWord = '',
  ...params
}) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetGanttChart`, {
      method: 'POST',
      data: {
        areaType,
        pageIndex,
        pageSize,
        sort,
        keyWord,
        ...params,
      },
    }),
  );
};

// 获取地图组件的area组件
export const getMapRegisterData = (areaId: string) => {
  return request(`/json/${areaId}.json`, { method: 'GET' });
};

// 获取项目操作log
export const fetchProjectOperationLog = (params: projectOperationLogParams) => {
  return cyRequest<RefreshDataType[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectOperateLog`, {
      method: 'POST',
      data: params,
    }),
  );
};


