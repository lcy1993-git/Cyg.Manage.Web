import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface ToDoRequestResult {
    awaitKnot: number
    awaitAllot: number
}

export const getToDoStatistics = () => {
    return cyRequest<ToDoRequestResult>(() =>
      request(`${baseUrl.project}/HomeStatistic/GetProjectPending`, { method: 'GET' }),
    );
  };

  interface RequestResult {
      key: string
      value: number
  }

  // 建设类型
  export const getProjectBuliding = () => {
    return cyRequest<RequestResult[]>(() =>
    request(`${baseUrl.project}/HomeStatistic/GetProjectConstructTypes`, { method: 'GET' }),
    );
  }

  export const getProjectStatus = () => {
    return cyRequest<RequestResult[]>(() =>
      request(`${baseUrl.project}/HomeStatistic/GetProjectStatus`, { method: 'GET' }),
    );
  };

  export const getProjectClassify = () => {
    return cyRequest<RequestResult[]>(() =>
      request(`${baseUrl.project}/HomeStatistic/GetProjectCategorys`, { method: 'GET' }),
    );
  };

  export const getProjectCategory = () => {
    return cyRequest<RequestResult[]>(() =>
      request(`${baseUrl.project}/HomeStatistic/GetProjectClassifications`, { method: 'GET' }),
    );
  };

  export const getProjectStage = () => {
    return cyRequest<RequestResult[]>(() =>
      request(`${baseUrl.project}/HomeStatistic/GetProjectStages`, { method: 'GET' }),
    );
  }

  export const getProjectLevel = () => {
    return cyRequest<RequestResult[]>(() =>
      request(`${baseUrl.project}/HomeStatistic/GetProjectKvLevels`, { method: 'GET' }),
    );
  }

  export const getProjectNatures = () => {
    return cyRequest<RequestResult[]>(() =>
      request(`${baseUrl.project}/HomeStatistic/GetProjectNatures`, { method: 'GET' }),
    );
  }

  export const getBuildType = () => {
    return cyRequest<RequestResult[]>(() =>
      request(`${baseUrl.project}/HomeStatistic/GetProjectConstructTypes`, { method: 'GET' }),
    );
  }

  export const getConsigns = (type: string) => {
    return cyRequest<RequestResult[]>(() =>
      request(`${baseUrl.project}/HomeStatistic/GetConsigns`, { method: 'POST', data: {type, limit: 5} }),
    );
  }

  export const getBurdens = (type: string) => {
    return cyRequest<RequestResult[]>(() =>
      request(`${baseUrl.project}/HomeStatistic/GetBurdens`, { method: 'POST', data: {type, limit: 5} }),
    );
  }

  interface MapStatisticsData {
    area: string
    engineerQuantity: number
    projectQuantity: number
  }

  export const getMapStatisticsData = (areaId: string) => {
    return cyRequest<MapStatisticsData[]>(() =>
      request(`${baseUrl.project}/HomeStatistic/GetMap`, {
        method: 'POST',
        data: { province: areaId, type: '1' },
      }),
    );
  };


