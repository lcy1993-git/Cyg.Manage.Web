import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface ModulesPropertyParams {
  libId: string;
  moduleId: string;
  moduleName: string;
  shortName: string;
  typicalCode: string;
  poleTypeCode: string;
  unit: string;
  moduleType: string;
  forProject: string;
  forDesign: boolean;
  remark: string;
  chartIds: string[];
}

interface ItemDetailData extends ModulesPropertyParams {
  //模块id
  id: string;
}

// interface ModulePropertyDeleteParams {
//   libId: string;
//   ids: string[];
// }

//获取单条模块数据
export const getModulesPropertyDetail = (libId: string, id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.resource}/Modules/GetById`, { method: 'GET', params: { libId, id } }),
  );
};

//新增模块
export const addModulesPropertyItem = (params: ModulesPropertyParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Modules/SaveCreate`, { method: 'POST', data: params }),
  );
};

//编辑模块
export const updateModulesPropertyItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Modules/SaveModify`, { method: 'POST', data: params }),
  );
};

// 删除
export const deleteModulesPropertyItem = (params: object) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Modules/Delete`, { method: 'POST', data: params }),
  );
};
