import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface ElectricCompanyItemParams {
  province: string;
  companyName: string;
  countyCompany: string;
  powerSupply: string;
}

interface ItemDetailData extends ElectricCompanyItemParams {
  //公司编号
  id: string;
}

//获取选中数据
export const getElectricCompanyDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/ElectricityCompany/GetById`, { method: 'GET', params: { id } }),
  );
};

//新增电力公司
export const addElectricCompanyItem = (params: ElectricCompanyItemParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ElectricityCompany/Create`, { method: 'POST', data: params }),
  );
};

//编辑电力公司
export const updateElectricityCompanyItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ElectricityCompany/Modify`, { method: 'POST', data: params }),
  );
};

// 删除
export const deleteElectricityCompanyItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ElectricityCompany/DeleteById`, { method: 'GET', params: { id } }),
  );
};

//导入 导出
