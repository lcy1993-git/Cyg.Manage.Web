import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface InfoManageItemParams {
  title: string;
  content: string;
  createdBy: string;
  createByUser: string; //创建者用户名
  createdOn: Date;
}

interface ItemDetailData extends InfoManageItemParams {
  id: string;
}

//获取选中数据
export const getNewsItemDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/News/GetById`, { method: 'GET', params: { id } }),
  );
};

//创建资讯
export const addNewsItem = (params: InfoManageItemParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/News/Create`, { method: 'POST', data: params }),
  );
};

//编辑资讯
export const updateNewsItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/News/Modify`, { method: 'POST', data: params }),
  );
};

// 删除资讯
export const deleteNewsItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/News/DeleteById`, { method: 'GET', params: { id } }),
  );
};

//推送资讯
export const pushNewsItem = (id: string, userIds: string[]) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/News/Push`, { method: 'POST', params: { id, userIds } }),
  );
};

//撤回功能
export const undoNewsItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/News/Revoke`, { method: 'GET', params: { id } }),
  );
};
