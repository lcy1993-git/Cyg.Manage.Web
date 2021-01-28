import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

export enum BelongModuleEnum {
  '菜单' = 1,
  '视图',
  '功能',
}

interface FunctionModuleItemParams {
  // 数据的父亲id
  parentId?: string;
  // 数据类型
  category: number;
  // 数据类型汉字
  categoryText: string;
  // 授权码
  authCode: string;
  // 名称
  name: string;
  // 图标名称
  icon?: string;
  // url
  url: string;
  // 排序
  sort: number;
  // 是否禁用
  isDisable: boolean;
}

interface ItemDetailData extends FunctionModuleItemParams {
  id: string;
}

export interface TreeDataItem extends FunctionModuleItemParams {
  // 数据id
  id: string;
  // 是否禁用
  isDisable: true;
  children?: TreeDataItem[];
}

// 获取模块列表的数据
export const getFunctionModuleTreeList = (): Promise<TreeDataItem[]> => {
  return cyRequest<TreeDataItem[]>(() =>
    request(`${baseUrl.project}/Module/GetTreeList`, { method: 'GET' }),
  );
};
// 新增一条数据
export const addFunctionModuleItem = (params: FunctionModuleItemParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Module/Create`, { method: 'POST', data: params }),
  );
};
// 更改状态
export const updateFunctionItemStatus = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Module/ChangeState`, { method: 'GET', params: { id } }),
  );
};
// 更新数据
export const updateFunctionModuleItem = (params: TreeDataItem) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Module/Modify`, { method: 'POST', data: params }),
  );
};

// 获取一条数据
export const getFunctionModuleDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/Module/GetById`, { method: 'GET', params: { id } }),
  );
};

export interface FunctionModuleTreeData {
  text: string;
  id: string;
  children: FunctionModuleTreeData[];
}

// 下拉选择获取数据
export const getTreeSelectData = () => {
  return cyRequest<FunctionModuleTreeData[]>(() =>
    request(`${baseUrl.project}/Module/GetTree`, { method: 'GET' }),
  );
};
// 删除
export const delectFunctionItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Module/DeleteById`, { method: 'GET', params: { id } }),
  );
};
