import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

// // 获取费用模板目录
// export const getCostTableDirectory = (engineeringTemplateId: string) => {
//   return cyRequest(() =>
//     request(`${baseUrl.tecEco}/EngineeringTemplateCostTable/QueryEngineeringTemplateCost`,
//       { method: 'GET', params: { engineeringTemplateId } }),
//   );
// }

export interface QueryData{
  "pageIndex": number,
  "pageSize": number,
  "sort": {
    "propertyName": string,
    "isAsc": boolean
  },
  "keyWord": string
}
// 查询定额常用表分页
export const queryCommonlyTablePager = (data: QueryData) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/CommonlyTable/QueryCommonlyTablePager`,
      { method: 'POST', data}),
  );
}
