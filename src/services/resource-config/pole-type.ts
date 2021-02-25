import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface PoleTypeParams {
  libId: string;
  poleTypeCode: string;
  poleTypeName: string;
  category: string;
  kvLevel: string;
  type: string;
  corner: string;
  material: string;
  loopNumber: string;
  isTension: boolean;
  remark: string;
  chartIds: string[];
}

interface ItemDetailData extends PoleTypeParams {
  //杆型id
  id: string;
}

//获取单条杆型数据
export const getPoleTypeDetail = (libId: string, id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.resource}/PoleType/GetById`, { method: 'GET', params: { libId, id } }),
  );
};

//新增杆型
export const addPoleTypeItem = (params: PoleTypeParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/PoleType/SaveCreate`, { method: 'POST', data: params }),
  );
};

//编辑杆型
export const updatePoleTypeItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/PoleType/SaveModify`, { method: 'POST', data: params }),
  );
};

// 删除
export const deletePoleTypeItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/PoleType/Delete`, { method: 'GET', params: { id } }),
  );
};
