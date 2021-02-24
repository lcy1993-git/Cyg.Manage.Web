import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface CableChannelParams {
  libId: string;
  channelId: string;
  channelName: string;
  shortName: string;
  typicalCode: string;
  channelCode: string;
  unit: string;
  reserveWidth: number;
  digDepth: number;
  layingMode: string;
  cableNumber: number;
  pavement: string;
  protectionMode: string;
  ductMaterialId: string;
  arrangement: string;
  bracketNumber: number;
  forProject: string;
  forDesign: string;
  remark: string;
  chartIds: string[];
}

interface ItemDetailData extends CableChannelParams {
  //组件id
  id: string;
}

//获取单条电缆通道数据
export const getCableChannelDetail = (libId: string, id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.resource}/CableChannel/GetById`, { method: 'GET', params: { libId, id } }),
  );
};

//新增电缆通道
export const addCableChannelItem = (params: CableChannelParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/CableChannel/SaveCreate`, { method: 'POST', data: params }),
  );
};

//编辑组件
export const updateCableChannelItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/CableChannel/SaveModify`, { method: 'POST', data: params }),
  );
};

// 删除电缆通道
export const deleteCableChannelItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/CableChannel/Delete`, { method: 'GET', params: { id } }),
  );
};
