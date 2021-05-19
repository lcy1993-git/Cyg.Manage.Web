import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface MaterialParams {
  libId: string;
  materialId: string;
  category: string;
  materialName: string;
  spec: string;
  unit: string;
  pieceWeight: number;
  unitPrice: number;
  materialType: string;
  usage: string;
  inspection: string;
  description: string;
  code: string;
  supplySide: string;
  transportationType: string;
  statisticType: string;
  kvLevel: string;
  forProject: string;
  forDesign: string;
  remark: string;
  chartIds: string[];
}

interface ItemDetailData extends MaterialParams {
  //物料id
  id: string;
}

//获取物料详情
export const getMaterialDetail = (libId: string, id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.resource}/Material/GetById`, { method: 'GET', params: { libId, id } }),
  );
};

//新增物料
export const addMaterialItem = (params: MaterialParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Material/SaveCreate`, { method: 'POST', data: params }),
  );
};

//编辑物料
export const updateMaterialItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Material/SaveModify`, { method: 'POST', data: params }),
  );
};

// 删除物料
export const deleteMaterialItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Material/Delete`, { method: 'POST', data: { id } }),
  );
};
