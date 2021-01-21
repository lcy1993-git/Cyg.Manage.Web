import {request} from "umi";
import { baseUrl, cyRequest } from "./common";

interface TableCommonRequestParams {
    PageIndex: number
    PageSize: number
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
    return cyRequest<TableRequestResult>(() => request(params.url,{method: "Post", requestType: "form", data: {...params.extraParams,PageIndex: params.PageIndex, PageSize: params.PageSize}}))
}

interface TreeTableParams {
    url: string
    params?: object
}

export const treeTableCommonRequeset = <T>(data: TreeTableParams) => {
    const {url, params = {}} = data
    return cyRequest<T[]>(() => request(`${baseUrl}${url}`,{method: "GET", params}));
}