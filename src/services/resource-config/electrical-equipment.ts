import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface ElectricalEquipmentParams {
  libId: string;
  componentId: string;
  componentName: string;
  componentSpec: string;
  typicalCode: string;
  unit: string;
  deviceCategory: number;
  componentType: string;

  kvLevel: string;
  forProject: string;
  forDesign: string;
  remark: string;
  chartIds: string[];
  isElectricalEquipment: boolean;
}

interface ItemDetailData extends ElectricalEquipmentParams {
  //组件id
  id: string;
}

//获取选中电气设备数据
export const getElectricalEquipmentDetail = (libId: string, id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.resource}/ElectricalEquipment/GetById`, {
      method: 'GET',
      params: { libId, id },
    }),
  );
};

//新增组件
export const addElectricalEquipmentItem = (params: ElectricalEquipmentParams) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.resource}/ElectricalEquipment/SaveCreate`, { method: 'POST', data: params }),
  );
};

//编辑组件
export const updateElectricalEquipmentItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ElectricalEquipment/SaveModify`, { method: 'POST', data: params }),
  );
};

// 删除物料
export const deleteElectricalEquipmentItem = (libId: string, ids: string[]) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ElectricalEquipment/Delete`, {
      method: 'POST',
      data: { libId, ids },
    }),
  );
};
