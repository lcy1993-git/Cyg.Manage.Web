import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

export interface ReviewListParams {
  id: string;
  type?: string;
  layer?: string;
}

export interface ReviewListItemType {
  id: string;
  name: string;
  type: string;
  layer: string;
  createdOn: string;
  modifyDate: string;
  status: string;
}

//获取选中数据
export const fetchReviewList = (params: ReviewListParams) => {
  return cyRequest<ReviewListItemType>(() =>
    request(
      `${baseUrl.webGis}/WebGis/GetEngineerProjectList
  `,
      { method: 'POST', data: params },
    ),
  );
};
