import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface CompanyManageItemParams {
  // 数据的父亲id
  parentId?: string;
  // 公司名
  name: string;
  // 公司地址
  address: string;
  // 备注
  remark: string;
  // 公司用户库存
  userSkuQtys: object[];
  isEnabled: boolean;
}

interface ItemDetailData extends CompanyManageItemParams {
  id: string;
  skus: object[];
}

export interface TreeDataItem extends CompanyManageItemParams {
  // 数据id
  id: string;
  // 是否禁用
  children?: TreeDataItem[];
}

//获取公司列表数据
export const getTreeSelectData = (): Promise<TreeDataItem[]> => {
  return cyRequest<TreeDataItem[]>(() =>
    request(`${baseUrl.project}/Company/GetTree`, { method: 'GET' }),
  );
};

//获取某条数据
export const getCompanyManageDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/Company/GetById`, { method: 'GET', params: { id } }),
  );
};

//新增一条数据
export const addCompanyManageItem = (params: CompanyManageItemParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Company/Create`, { method: 'POST', data: params }),
  );
};

//编辑接口
export const updateCompanyManageItem = (params: TreeDataItem) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Company/Modify`, { method: 'POST', data: params }),
  );
};

//启用
export const enabledCompanyStatus = (companyId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Company/Enabled`, { method: 'POST', params: { companyId } }),
  );
};

//禁用
export const disabledCompanyStatus = (companyId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Company/Disabled`, { method: 'POST', params: { companyId } }),
  );
};
