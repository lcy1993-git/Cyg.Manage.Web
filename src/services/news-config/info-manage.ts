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
  isEnable: boolean;
}

//获取选中数据
export const getNewsItemDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/Article/GetById`, { method: 'GET', params: { id } }),
  );
};

//添加宣贯
export const addNewsItem = (params: InfoManageItemParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Article/Create`, { method: 'POST', data: params }),
  );
};

//编辑资讯
export const updateNewsItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Article/Modify`, { method: 'POST', data: params }),
  );
};

//更新宣贯状态
export const updateNewsState = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Article/ModifyState`, { method: 'POST', data: params }),
  );
};

// 删除资讯
export const deleteNewsItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Article/DeleteById`, { method: 'GET', params: { id } }),
  );
};

//推送资讯
// export const pushNewsItem = (id: string, userIds: string[]) => {
//   return cyRequest(() =>
//     request(`${baseUrl.project}/News/Push`, { method: 'POST', data: { id, userIds } }),
//   );
// };

//撤回功能
export const undoNewsItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/News/Revoke`, { method: 'GET', params: { id } }),
  );
};
