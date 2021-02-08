import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface CompanyFileItemParams {
  name: string;
  companyId: string;
  fileId: string;
  fileCategory: number;
  fileCategoryText: string;
  describe: string;
  createdOn: string;
}

interface ItemDetailData extends CompanyFileItemParams {
  id: string;
}

//获取选中数据
export const getCompanyFileDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/CompanyFile/GetById`, { method: 'GET', params: { id } }),
  );
};

//新增字段映射
export const addCompanyFileItem = (params: CompanyFileItemParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyFile/Create`, { method: 'POST', data: params }),
  );
};

//编辑字段映射
export const updateCompanyFileItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyFile/Modify`, { method: 'POST', data: params }),
  );
};

// 删除字段映射
export const deleteCompanyFileItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyFile/DeleteById`, { method: 'GET', params: { id } }),
  );
};
