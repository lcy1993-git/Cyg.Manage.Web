import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';
import { EngineerProjetListFilterParams } from '../visualization-results/side-menu';

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

export const GetEngineerProjectCommentListByParams = (params: EngineerProjetListFilterParams) => {
  return cyRequest<any>(() =>
    request(
      `${baseUrl.webGis}/WebGis/GetEngineerProjectCommentList
    `,
      { method: 'POST', data: params },
    ),
  );
};

//获取选中数据
export const GetProjectCommentListByParams = (params: ReviewListParams) => {
  return cyRequest<ReviewListItemType>(() =>
    request(
      `${baseUrl.webGis}/WebGis/GetProjectCommentList
  `,
      { method: 'POST', data: params },
    ),
  );
};
