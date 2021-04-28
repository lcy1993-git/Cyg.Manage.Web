import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface InfoManageItemParams {
  title: string;
  content: string;
  createdBy: string;
  createByUser: string; //创建者用户名
  createdOn: Date;
}

interface ReviewListParams {
  id: string;
}

//获取选中数据
export const fetchReviewList = (params: ReviewListParams) => {
  return cyRequest(() =>
    request(
      `${baseUrl.webGis}/WebGis/GetEngineerProjectList
  `,
      { method: 'POST', data: params },
    ),
  );
};
