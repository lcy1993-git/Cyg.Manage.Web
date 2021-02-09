import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

export enum SourceType {
  '全部',
  '勘察端',
  '设计端',
  '管理端',
}

export enum Category {
  '全部',
  'Bug',
  '建议',
}

export enum Status {
  '全部',
  '待处理',
  '处理中',
  '处理完成',
}

export enum HanleStatus {
  "处理中" = 1,
  "处理完成"
}

interface SearchLogItemParams {
  //开始搜索日期
  startDate: Date;

  endDate: Date;
}

interface ItemDetailData extends SearchLogItemParams {
  id: string;
  category: number;
  title: string;
  lastProcessDate: Date;
  processStatus: number;
  remark: string;
  createdOn: Date;
  sourceType: number;
  createdBy: string;
}

// 获取搜索结果列表
export const getFeedbackList = (parmas: SearchLogItemParams) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/Feedback/GetPagedList`, { method: 'POST', data: parmas }),
  );
};

// 获取一条数据
export const getFeedbackDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/Feedback/GetDetailById`, { method: 'GET', params: { id } }),
  );
};
