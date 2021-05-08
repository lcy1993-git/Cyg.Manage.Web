import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

export interface ReviewRequestType {
  projectId: string;
  deviceId: string;
  deviceType: number;
  layerType: number;
  content: string;
  title?: string;
}

export interface fetchReviewListType {
  projectId: string;
  layer: number;
  deviceId: string;
}

export interface ReviewType {
  content: string;
  creator: string;
  createdOn: string;
}

/**
 * 添加审阅
 * 接口文档 http://10.6.1.36:8025/help/index.html
 * @param requestData
 * @returns
 */
export const addReview = (requestData: ReviewRequestType) => {
  return cyRequest<any>(() =>
    request(
      `${baseUrl.comment}/Comment/CreateProjectComment
    `,
      { method: 'POST', data: requestData },
    ),
  );
};

export const fetchReviewList = (params: fetchReviewListType) => {
  return cyRequest<ReviewType[]>(() =>
    request(
      `${baseUrl.comment}/Comment/GetProjectCommentItemList
    `,
      { method: 'POST', data: params },
    ),
  );
};
