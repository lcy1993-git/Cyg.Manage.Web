import request from '@/utils/request';
import { baseUrl, cyRequest } from '../common';

/** 统一路由前缀
 * @see http://10.6.1.36:8026/help/index.html
 */
const prefix = '/ProjectStatistics_v2';

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

/** 获取项目进度统计（单个公司） */
export const getCompanyProjectProgressList = (companyId: string) => {
  return cyRequest<ProjectProgress[]>(() =>
    request(`${baseUrl.project}${prefix}/GetStatisticsListByProject`, { params: { companyId } }),
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
export const getAllCompanyProgressList = () => {
  return cyRequest<CompanyProgress[]>(() =>
    request(`${baseUrl.project}${prefix}/GetStatisticsListByCompany`),
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
}

interface WithLimit {
  limit: number;
}

/** 统计项目状态（饼图） */
export const getProjectStatisticsOfPie = (companyId?: string) => {
  return cyRequest<Record<'content', ProjectStatisticsOfPie>>(() =>
    request(`${baseUrl.project}${prefix}/GetProjectStatusQty`, { params: { companyId } }),
  );
};

/** 获取项目进度榜（单个公司级） */
export const getCompanyProjectProgressRank = (params: WithCompany & WithLimit) => {
  return cyRequest<Item[]>(() =>
    request(`${baseUrl.project}${prefix}/GetLeaderboardByProject`, { params }),
  );
};

/** 获取综合进度榜 */
export const getProjectProgressRank = (limit: number) => {
  return cyRequest<Item[]>(() =>
    request(`${baseUrl.project}${prefix}/GetLeaderboardByCompany`, { params: { limit } }),
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

/** 获取逾期统计（所有公司） */
export const getAllCompanyOverdue = (data?: WithCompany & WithLimit) => {
  return cyRequest<CompanyOverdue[]>(() =>
    request(`${baseUrl.project}${prefix}/GetOverduesByProject`, { method: 'post', data }),
  );
};

/** 获取逾期统计（单个公司） */
export const getCompanyOverdue = (limit: number) => {
  return cyRequest<CompanyOverdue[]>(() =>
    request(`${baseUrl.project}${prefix}/GetOverduesByCompany`, { params: { limit } }),
  );
};

export const getStatisticsListByCompany = () => {
  return cyRequest<any[]>(() => request(`${baseUrl.project}${prefix}/GetStatisticsListByCompany`));
};

export const getStatisticsListByProject = (companyId: string) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.project}${prefix}/GetStatisticsListByProject`, { params: { companyId } }),
  );
};

// 项目实时数据
export const getProjectOperateLogs = (companyId: string, limit: number) => {
  return cyRequest<CompanyOverdue[]>(() =>
    request(`${baseUrl.project}${prefix}/GetProjectOperateLogs`, {
      method: 'post',
      data: { companyId, limit },
    }),
  );
};

interface DayDataItem {
  key: string;
  value: number;
}

// 项目每日变化
export const getProjectQtyOfDay = (companyId: string, status: number) => {
  return cyRequest<DayDataItem[]>(() =>
    request(`${baseUrl.project}${prefix}/GetProjectQtyOfDay`, {
      method: 'post',
      data: { companyId, status },
    }),
  );
};

// 统计项目状态
