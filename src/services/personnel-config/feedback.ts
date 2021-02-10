import request from '@/utils/request';
import { Moment } from 'moment';
import { cyRequest, baseUrl } from '../common';

export enum CategoryEnum {
  'Bug' = 1,
  '建议',
}

interface UserFeedBackItemParams {
  category: number;
  categoryText: string;
  title: string;
  lastProcessData: Moment;
  processStatus: number;
  processStatusText: number;
  remark: string;
  createdOn: Moment;
  phone: string;
}

interface AddUserFeedBackItem extends UserFeedBackItemParams {
  sourceType: number;
}

export interface ItemDetailData extends UserFeedBackItemParams {
  id: string;
}

//获取选中数据
export const getUserFeedBackDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.common}/Feedback/GetDetail`, { method: 'GET', params: { id } }),
  );
};

//新增公司用户
export const addUserFeedBackItem = (params: AddUserFeedBackItem) => {
  return cyRequest(() =>
    request(`${baseUrl.common}/Feedback/Create`, { method: 'POST', data: params }),
  );
};

export const getFeedBackList = () => {
  return cyRequest(() => request(`${baseUrl.common}/Feedback/GetList`, { method: 'POST' }));
};

export const replyTheFeedback = (params: any) => {
  return cyRequest(() => request(`${baseUrl.common}/Feedback/Reply`, { method: 'POST', data: params }));
}
