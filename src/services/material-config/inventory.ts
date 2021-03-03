import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface WareHouseParams {
  province: string;
  name: string;
  version: string;
  remark: string;
  companyId: string;
}

interface ItemDetailData extends WareHouseParams {
  //利库编号
  id: string;
  overviewId: string;
}

//获取协议库存列表
export const getInventoryOverviewList = () => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.resource}/Inventory/GetInventoryOverviewList`, { method: 'GET' }),
  );
};

//获取单条利库数据
export const getWareHouseDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.resource}/WareHouse/GetById`, { method: 'GET', params: { id } }),
  );
};

//新增利库
export const addWareHouseItem = (params: WareHouseParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/WareHouse/SaveCreate`, { method: 'POST', data: params }),
  );
};

//编辑利库信息
export const updateWareHouseItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/WareHouse/SaveModify`, { method: 'POST', data: params }),
  );
};

// 删除利库?
export const deleteWareHouseItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/WareHouse/Delete`, { method: 'POST', params: { id } }),
  );
};

//重启资源服务
export const restartWareHouse = () => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/WareHouse/RestartService`, { method: 'POST' }),
  );
};

//导入
export const importWareHouseItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/WareHouse/SaveImport`, { method: 'POST', data: params }),
  );
};
