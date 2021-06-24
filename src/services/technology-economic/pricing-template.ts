import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

export interface AddPricingTemplate {
  no: string;
  engineeringTemplateType: number;
  publishDate: string;
  version: string;
  remark: string;
  enabled: boolean;
}
interface GetPage {
  pageIndex: number;
  pageSize: number;
  sort?: {
    propertyName?: string;
    isAsc?: boolean;
  };
  keyWord?: string;
}
// 创建设计模板
export const addPricingTemplate = (params: AddPricingTemplate) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/EngineerTemplate/AddEngineeringTemplate`, {
      method: 'POST',
      data: params,
    }),
  );
};

// 编辑设计模板
export type EditPricingTemplate = AddPricingTemplate & { id: string };
export const editPricingTemplate = (params: EditPricingTemplate) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/EngineerTemplate/EditEngineeringTemplate`, {
      method: 'POST',
      data: params,
    }),
  );
};

// 设置设计模板状态
export const setPricingTemplate = (id: string, enabled: boolean) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/EngineerTemplate/SetEngineeringTemplateStatus`, {
      method: 'GET',
      params: { id, enabled },
    }),
  );
};

// 删除设计模板
export const deletePricingTemplate = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/EngineerTemplate/DeleteEngineeringTemplate`, {
      method: 'GET',
      params: { id },
    }),
  );
};
// 设计模板列表查询

export const queryQuotaLibraryPager = (params: GetPage) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/EngineerTemplate/QueryEngineeringTemplatePager`, {
      method: 'POST',
      data: params,
    }),
  );
};
