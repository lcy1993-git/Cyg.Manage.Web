import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

export interface CommentRequestType {
  projectId: string;
  deviceId: string;
  deviceType: number;
  layerType: number;
  content: string;
  title?: string;
}

export interface fetchCommentListType {
  projectId: string;
  layer: number;
  deviceId: string;
}

export interface CommentType {
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
export const addComment = (requestData: CommentRequestType) => {
  return cyRequest<any>(() =>
    request(
      `${baseUrl.comment}/Comment/CreateProjectComment
    `,
      { method: 'POST', data: requestData },
    ),
  );
};

export const fetchCommentList = (params: fetchCommentListType) => {
  return cyRequest<CommentType[]>(() =>
    request(
      `${baseUrl.comment}/Comment/GetProjectCommentItemList
    `,
      { method: 'POST', data: params },
    ),
  );
};
