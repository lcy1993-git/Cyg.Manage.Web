import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';
import {QueryData} from "@/services/technology-economic/usual-quota-table";
import { SuppliesbleRow } from '@/pages/technology-economic/supplies-library';


// 查询物料库树
export const getMaterialLibraryTreeById = (engineeringTemplateId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/GetMaterialLibraryTreeById`,
      { method: 'GET', params: { engineeringTemplateId } }),
  );
}

// 查询物料库列表
export const getMaterialLibraryList = (data: QueryData) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.tecEco1}/MaterialLibrary/GetMaterialLibraryList`,
      { method: 'POST', data }),
  );
}


// 导入总算表
export const importEngineeringInfoCostTotal = (EngineeringTemplateId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/EngineeringTotal/QueryEngineeringInfoCostTotal`,
      { method: 'POST', data: {EngineeringTemplateId} }),
  );
}
