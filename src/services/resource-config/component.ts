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
export const deleteComponentItem = (libId: string, ids: string[]) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Component/Delete`, { method: 'POST', data: { libId, ids } }),
  );
};

/**组件明细操作 */
interface ComponentDetailParams {
  id: string;
  belongComponentId: string;
  componentId: string;
  componentName: string;
  materialId: string;
  itemId: string;
  itemName: string;
  itemNumber: number;
  isComponent: number;
}

//获取单条明细数据
export const getComponentDetailItem = (libId: string, id: string) => {
  return cyRequest<ComponentDetailParams>(() =>
    request(`${baseUrl.resource}/ComponentDetail/GetById`, {
      method: 'GET',
      params: { libId, id },
    }),
  );
};

//新增电缆井明细
export const addComponentDetailItem = (params: ComponentDetailParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ComponentDetail/SaveCreate`, { method: 'POST', data: params }),
  );
};

//编辑明细
export const updateComponentDetailItem = (params: ComponentDetailParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ComponentDetail/SaveModify`, { method: 'POST', data: params }),
  );
};

// 删除明细
export const deleteComponentDetailItem = (libId: string, id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ComponentDetail/Delete`, {
      method: 'POST',
      params: { libId, id },
    }),
  );
};

/**组件属性操作 */

interface ComponentPropertyParams {
  id: string;
  componentId: string;
  propertyName: string;
  propertyValue: string;
}

//获取单条明细数据
export const getComponentPropertyItem = (libId: string, id: string) => {
  return cyRequest<ComponentPropertyParams>(() =>
    request(`${baseUrl.resource}/ComponentProperty/GetById`, {
      method: 'GET',
      params: { libId, id },
    }),
  );
};

//新增电缆井明细
export const addComponentPropertyItem = (params: ComponentPropertyParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ComponentProperty/SaveCreate`, { method: 'POST', data: params }),
  );
};

//编辑明细
export const updateComponentPropertyItem = (params: ComponentPropertyParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ComponentProperty/SaveModify`, { method: 'POST', data: params }),
  );
};

// 删除明细
export const deleteComponentPropertyItem = (libId: string, id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ComponentProperty/Delete`, {
      method: 'POST',
      params: { libId, id },
    }),
  );
};
