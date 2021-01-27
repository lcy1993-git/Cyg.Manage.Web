import { request } from 'umi';
import { cyRequest, baseUrl } from '../../common';

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
  userStock: number;
}

interface ItemDetailData extends CompanyManageItemParams {
  id: string;
  //   addUserStock: number;
}

export interface TreeDataItem extends CompanyManageItemParams {
  // 数据id
  id: string;
  // 是否禁用
  children?: TreeDataItem[];
}

//获取公司列表数据
// export const getCompanyManageTreeList = (): Promise<TreeDataItem[]> => {
//   return cyRequest<TreeDataItem[]>(() =>
//     request(`${baseUrl}/Company/GetTreeList`, { method: 'GET' }),
//   );
// };

//获取某条数据
export const getCompanyManageDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl}/Company/GetById`, { method: 'GET', params: { id } }),
  );
};

//新增一条数据
export const addCompanyManageItem = (params: CompanyManageItemParams) => {
  return cyRequest(() => request(`${baseUrl}/Company/Create`, { method: 'POST', data: params }));
};

//编辑接口
export const updateCompanyManageItem = (params: TreeDataItem) => {
  return cyRequest(() => request(`${baseUrl}/Company/Modify`, { method: 'POST', data: params }));
};


