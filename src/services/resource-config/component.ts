import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface ComponentParams {
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

interface ItemDetailData extends ComponentParams {
  //组件id
  id: string;
}

//获取组件详情
export const getComponentDetail = (libId: string, id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.resource}/Component/GetById`, { method: 'GET', params: { libId, id } }),
  );
};

//新增组件
export const addComponentItem = (params: ComponentParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Component/SaveCreate`, { method: 'POST', data: params }),
  );
};

//编辑组件
export const updateComponentItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Component/SaveModify`, { method: 'POST', data: params }),
  );
};

// 删除物料
export const deleteComponentItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Component/Delete`, { method: 'GET', params: { id } }),
  );
};
