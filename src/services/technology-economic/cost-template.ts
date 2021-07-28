import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

// 获取费用模板目录
export const getCostTableDirectory = (engineeringTemplateId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/EngineeringTemplateCostTable/QueryEngineeringTemplateCost`,
      { method: 'GET', params: { engineeringTemplateId } }),
  );
}
// 查询费用模板项目
export const getCostTableProject = (costId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/EngineeringTemplateCostTable/QueryEngineeringTemplateCostNode`,
      { method: 'GET', params: { costId } }),
  );
}

// 定额项 - 获取定额项列表
export const ImportEngineeringTemplateCostTable = (EngineeringTemplateId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/EngineeringTemplateCostTable/ImportEngineeringTemplateCostTable`,
      { method: 'POST', data: { EngineeringTemplateId} }),
  );
}
