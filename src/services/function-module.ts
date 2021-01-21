import {request} from "umi";
import { cyRequest,baseUrl } from "./common";

export enum BelongModuleEnum {
    "菜单",
    "视图",
    "功能"
}

interface FunctionModuleItemParams  {
    // 数据的父亲id
    parentId?: string,
    // 数据类型
    category: number,
    // 数据类型汉字
    categoryText: string,
    // 授权码
    authCode: string,
    // 名称
    name: string,
    // 图标名称
    icon?: string,
    // url
    url: string,
    // 排序
    sort: number,
}

export interface TreeDataItem extends FunctionModuleItemParams {
    // 数据id
    id: string,
    // 是否禁用
    isDisable: true,
    children?: TreeDataItem[]
}

// 获取模块列表的数据
export const getFunctionModuleTreeList = (): Promise<TreeDataItem[]> => {
   return cyRequest<TreeDataItem[]>(() => request(`${baseUrl}/Module/GetTreeList`, {method: "GET"}))
}
// 新增一条数据
export const addFunctionModuleItem = (params: FunctionModuleItemParams) => {
    return cyRequest(() => request(`${baseUrl}/Module/Create`, {method: "POST", params}))
}
// 更改状态
export const updateFunctionItemStatus = (id: string) => {
    return cyRequest(() => request(`${baseUrl}/Module/ChangeState`, {method: "GET", data: {id}}))
}
// 更新数据
export const updateFunctionModuleItem = (params: TreeDataItem) => {
    return cyRequest(() => request(`${baseUrl}/Module/Modify`, {method: "POST", params}))
}
// 下拉选择获取数据
export const getTreeSelectData = () => {
    return cyRequest(() => request(`${baseUrl}/Module/GetTree`, {method: "GET"}))
}
// 删除
export const delectFunctionItem = (id: string) => {
    return cyRequest(() => request(`${baseUrl}/Module/DeleteById`, {method: "GET",  data: {id}}))
}


