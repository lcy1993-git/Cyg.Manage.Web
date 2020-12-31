import {request} from "umi";
import { cyRequest } from "./common";

interface TableCommonRequestParams {
    PageIndex: number
    PageSize: number
    url: string
    extraParams?: object
}

interface TableRequestResult {
    pageIndex: number
    pageSize: number
    total: number
    totalPage: number
    items: object[]
}

export const tableCommonRequest = (params: TableCommonRequestParams) => {
    return cyRequest<TableRequestResult>(() => request(params.url,{method: "Post", requestType: "form", data: {...params.extraParams,PageIndex: params.PageIndex, PageSize: params.PageSize}}))
}