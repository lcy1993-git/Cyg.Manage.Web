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
}

interface ItemDetailData extends MaterialParams {
  //物料id
  id: string;
}

//获取资源库详情
export const getMaterialDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.resource}/Material/GetById`, { method: 'GET', params: { id } }),
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
    request(`${baseUrl.resource}/Material/Modify`, { method: 'POST', data: params }),
  );
};

// 删除资源库.?
export const deleteResourceLibItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ResourceLib/Delete`, { method: 'GET', params: { id } }),
  );
};

export const restartResourceLib = () => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ResourceLib/RestartService`, { method: 'POST' }),
  );
};
