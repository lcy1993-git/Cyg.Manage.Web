import request from '@/utils/request';
import { baseUrl, cyRequest } from '../common';

/** 统一路由前缀
 * @see http://10.6.1.36:8026/help/index.html
 */
const prefix = '/ProjectStatistics';

/** 统计状态 */
export interface ProjectStatus {
  value: number;
  text: string;
}

/** 获取统计状态列表 */
export const getStatusFilterList = () => {
  return cyRequest<Record<'content', ProjectStatus[]>>(() =>
    request(`${baseUrl.project}${prefix}/GetStatusFilterList`),
  );
};

/** 单条项目进度统计 */
export interface ProjectProgress {
  id?: string;
  name?: string;
  planDays?: number;
  progressRate?: number;
  status?: number;
  statusText?: string;
  overdueDays?: number;
  lastOperationTime?: string;
}
interface StatisParams {
  companyId: string;
  projectShareCompanyId: string;
  status?: number;
}

/** 获取项目进度统计（单个公司） */
export const getCompanyProjectProgressList = (params: StatisParams) => {
  return cyRequest<ProjectProgress[]>(() =>
    request(`${baseUrl.project}${prefix}/GetStatisticsListByProject`, {
      method: 'POST',
      data: params,
    }),
  );
};
export interface CompanyProgress {
  id?: string;
  name?: string;
  progressRate?: number;
  lastOperationTime?: number;
  statusQtyModel1?: StatusQtyModel1;
  statusQtyModel2?: StatusQtyModel1;
  statusQtyModel3?: StatusQtyModel1;
  statusQtyModel4?: StatusQtyModel1;
  statusQtyModel5?: StatusQtyModel1;
  statusQtyModel6?: StatusQtyModel1;
  statusQtyModel7?: StatusQtyModel1;
}

export interface StatusQtyModel1 {
  /** 昨日数量 */
  yesterdayQty?: number;
  /** 今日数量 */
  todayQty?: number;
}

/** 获取所有公司的进度统计 */
export const getAllCompanyProgressList = (params: { companyId: string }) => {
  return cyRequest<CompanyProgress[]>(() =>
    request(`${baseUrl.project}${prefix}/GetStatisticsListByCompany`, {
      method: 'POST',
      data: params,
    }),
  );
};

type DailyChangeStatisticsParams = {
  companyId?: string;
  /** 状态，例如 "勘察中"，在统计状态列表中查找对应的 value */
  status?: number;
};

/**
 * 获取每日变化统计
 * @param params
 */
export const getDailyChangeStatistics = (params?: DailyChangeStatisticsParams) => {
  return cyRequest<{ key: string; value: number }[]>(() =>
    request(`${baseUrl.project}${prefix}/GetStatisticsListByCompany`, { params }),
  );
};

export interface ProjectStatisticsOfPie {
  totalQty?: number;
  designedQty?: number;
  completionRate?: number;
  items?: Item[];
}

interface Item {
  key?: string;
  value?: number;
}

interface WithCompany {
  companyId: string;
  projectShareCompanyId?: string;
}

interface WithLimit {
  limit: number;
}

/** 统计项目状态（饼图） */
export const getProjectStatisticsOfPie = (params: StatisParams) => {
  return cyRequest<Record<'content', ProjectStatisticsOfPie>>(() =>
    request(`${baseUrl.project}${prefix}/GetProjectStatusQty`, { data: params }),
  );
};

/** 获取项目进度榜（单个公司级） */
export const getCompanyProjectProgressRank = (data: WithCompany & WithLimit) => {
  return cyRequest<Item[]>(() =>
    request(`${baseUrl.project}${prefix}/GetLeaderboardByProject`, { method: 'post', data }),
  );
};

/** 获取综合进度榜 */
export const getProjectProgressRank = () => {
  return cyRequest<Item[]>(() =>
    request(`${baseUrl.project}${prefix}/GetLeaderboardByCompany`, { params: { limit: 9999 } }),
  );
};

/** 获取实时项目数据 */
export const getCurrentProjectList = (params?: WithCompany & WithLimit) => {
  return cyRequest<Item[]>(() =>
    request(`${baseUrl.project}${prefix}/GetLeaderboardByCompany`, { method: 'post', params }),
  );
};

export interface CompanyOverdue {
  projectId?: string;
  projectName?: string;
  status?: number;
  statusText?: string;
}

/** 获取逾期统计（按项目） */
export const getProjectOverdue = (data?: WithCompany & WithLimit) => {
  return cyRequest<CompanyOverdue[]>(() =>
    request(`${baseUrl.project}${prefix}/GetOverduesByProject`, { method: 'post', data }),
  );
};

/** 获取逾期统计（按公司） */
export const getCompanyOverdue = (params: WithCompany & WithLimit) => {
  return cyRequest<CompanyOverdue[]>(() =>
    request(`${baseUrl.project}${prefix}/GetOverduesByCompany`, {
      method: 'POST',
      data: params,
    }),
  );
};

export const getStatisticsListByCompany = (params: WithCompany) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.project}${prefix}/GetStatisticsListByCompany`, {
      method: 'POST',
      data: params,
    }),
  );
};

export const getStatisticsListByProject = (params: {
  projectShareCompanyId: string;
  companyId: string;
}) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.project}${prefix}/GetStatisticsListByProject`, {
      method: 'POST',
      data: params,
    }),
  );
};

// 项目实时数据
export const getProjectOperateLogs = (params: StatisParams & WithLimit) => {
  return cyRequest<CompanyOverdue[]>(() =>
    request(`${baseUrl.project}${prefix}/GetProjectOperateLogs`, {
      method: 'post',
      data: params,
    }),
  );
};

interface DayDataItem {
  key: string;
  value: number;
}

// 项目每日变化
export const getProjectQtyOfDay = (params: StatisParams) => {
  return cyRequest<DayDataItem[]>(() =>
    request(`${baseUrl.project}${prefix}/GetProjectQtyOfDay`, {
      method: 'post',
      data: params,
    }),
  );
};

// 统计项目状态
