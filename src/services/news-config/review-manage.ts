import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';
import { EngineerProjetListFilterParams } from '../visualization-results/side-menu';

export interface ReviewListParams {
  projectIds?: string[];
  engineerId?: string;
  layerTypes?: number[];
}

export interface ReviewListItemType {
  id: string;
  createdOn: string;
  status: number;
  engineerId: string;
  projectId: string;
  companyName: string;
  projectName: string;
  deviceType: number;
  layerType: number;
  deviceId: string;
  deviceName: string;
  title: string;
  lastUpdateDate: string;
  createdBy: string;
}

export const fetchReviewList = (params: ReviewListParams) => {
  return cyRequest<ReviewListItemType[]>(() =>
    request(
      `${baseUrl.comment}/Comment/GetProjectCommentList
    `,
      { method: 'POST', data: params },
    ),
  );
};

//获取选中数据
