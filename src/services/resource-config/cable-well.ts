import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface CableWellParams {
  libId: string;
  cableWellId: string;
  cableWellName: string;
  shortName: string;
  typicalCode: string;
  type: string;
  unit: string;
  width: number;
  depth: number;
  isConfined: number;
  isSwitchingPipe: number;
  feature: string;
  pavement: string;
  size: string;
  coverMode: string;
  grooveStructure: string;
  forProject: string;
  forDesign: string;
  remark: string;
  chartIds: string[];
}

interface ItemDetailData extends CableWellParams {
  //电缆井id
  id: string;
}

//获取单条电缆通道数据
export const getCableWellDetail = (libId: string, id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.resource}/CableWell/GetById`, { method: 'GET', params: { libId, id } }),
  );
};

//新增电缆通道
export const addCableWellItem = (params: CableWellParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/CableWell/SaveCreate`, { method: 'POST', data: params }),
  );
};

//编辑组件
export const updateCableWellItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/CableWell/SaveModify`, { method: 'POST', data: params }),
  );
};

// 删除电缆通道
export const deleteCableWellItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/CableWell/Delete`, { method: 'GET', params: { id } }),
  );
};
