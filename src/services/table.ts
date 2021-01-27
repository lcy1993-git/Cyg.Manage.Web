import {request} from "umi";
import { baseUrl, cyRequest } from "./common";

interface TableCommonRequestParams {
    pageIndex: number
    pageSize: number
    url: string
    extraParams?: object
}

export interface TableRequestResult {
    pageIndex: number
    pageSize: number
    total: number
    totalPage: number
    items: object[]
}

export const tableCommonRequest = (params: TableCommonRequestParams): Promise<TableRequestResult> => {
    return cyRequest<TableRequestResult>(() => request(`${baseUrl.project}${params.url}`,{method: "Post", data: {...params.extraParams,PageIndex: params.pageIndex, PageSize: params.pageSize}}))
}

interface TreeTableParams {
    url: string
    params?: object
}

export const treeTableCommonRequeset = <T>(data: TreeTableParams) => {
    const {url, params = {}} = data
    return cyRequest<T[]>(() => request(`${baseUrl.project}${url}`,{method: "GET", params}));
}