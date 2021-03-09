import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

export enum BelongModuleEnum {
  '待定1' = 1,
  '待定2',
  '待定3',
}

interface CompanyGroupItemParams {
  // 父级Id
  parentId?: string;

  //部组名称
  name: string;

  //部组成员多个
  userIds: string;

  //部组管理员
  adminUserId: string;

  companyId: string;

  users: string;
}

interface ItemDetailData extends CompanyGroupItemParams {
  id: string;
}

export interface TreeDataItem extends CompanyGroupItemParams {
  // 数据id
  id: string;
  children?: TreeDataItem[];
}

// 获取展开部组的树形数据
export const getCompanyGroupTreeList = (): Promise<TreeDataItem[]> => {
  return cyRequest<TreeDataItem[]>(() =>
    request(`${baseUrl.project}/CompanyGroup/GetTreeList`, { method: 'GET' }),
  );
};
// 新增部组
export const addCompanyGroupItem = (params: CompanyGroupItemParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyGroup/Create`, { method: 'POST', data: params }),
  );
};
//编辑部组
export const updateCompanyGroupItem = (params: TreeDataItem) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyGroup/Modify`, { method: 'POST', data: params }),
  );
};

// 获取一条数据
export const getCompanyGroupDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/CompanyGroup/GetById`, { method: 'GET', params: { id } }),
  );
};

export interface CompanyGroupTreeData {
  text: string;
  id: string;
  children: CompanyGroupTreeData[];
}

// 下拉选择获取数据
export const getTreeSelectData = () => {
  return cyRequest<CompanyGroupTreeData[]>(() =>
    request(`${baseUrl.project}/CompanyGroup/GetTree`, { method: 'GET' }),
  );
};
// 删除
export const deleteCompanyGroupItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyGroup/DeleteById`, { method: 'GET', params: { id } }),
  );
};
