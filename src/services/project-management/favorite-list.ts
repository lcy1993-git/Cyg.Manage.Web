/* 工程收藏夹接口 */
import request from '@/utils/request';
import { baseUrl, cyRequest } from '../common';

// 创建收藏夹
export const creatFavorite = (params: { name: string; parentId?: string }) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/EngineerFavorites/Create`, { method: 'POST', data: params }),
  );
};

//修改收藏夹名称
export const modifyFavoriteName = (params: { id: string; name: string }) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/EngineerFavorites/Modify`, { method: 'POST', data: params }),
  );
};

//删除收藏夹
export const deleteFavorite = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/EngineerFavorites/DeleteById`, {
      method: 'GET',
      params: { id: id },
    }),
  );
};

//添加收藏工程
export const addCollectionEngineers = (params: { id: string; engineerIds: string[] }) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/EngineerFavorites/AddCollectionEngineers`, {
      method: 'POST',
      data: params,
    }),
  );
};

//移除收藏工程
export const removeCollectionEngineers = (params: { id: string; engineerIds: string[] }) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/EngineerFavorites/RemoveCollectionEngineers`, {
      method: 'POST',
      data: params,
    }),
  );
};

// 获取收藏夹
export const getFavorites = () => {
  return cyRequest(() =>
    request(`${baseUrl.project}/EngineerFavorites/GetTree`, { method: 'GET' }),
  );
};
