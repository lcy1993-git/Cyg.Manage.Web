import request from '@/utils/request';
import { baseUrl, cyRequest } from './common';
import qs from 'qs';

interface TableCommonRequestParams {
  pageIndex: number;
  pageSize: number;
  url: string;
  extraParams?: object;
  requestSource: 'project' | 'common' | 'resource' | 'tecEco' | 'tecEco1';
  postType: 'body' | 'query';
}

export interface TableRequestResult {
  pageIndex: number;
  pageSize: number;
  total: number;
  totalPage: number;
  items: object[];
}

export const tableCommonRequest = (
  params: TableCommonRequestParams,
): Promise<TableRequestResult> => {
  // let requestBaseUrl = baseUrl[params.requestSource];
  let requestBaseUrl = baseUrl['tecEco1'];
  if (params.postType == 'body') {
    return cyRequest<TableRequestResult>(() =>
      request(`${requestBaseUrl}${params.url}`, {
        method: 'Post',
        data: { ...params.extraParams, PageIndex: params.pageIndex, PageSize: params.pageSize },
      }),
    );
  } else {
    const queryUrl = `${requestBaseUrl}${params.url}?${qs.stringify(params.extraParams)}`;
    return cyRequest<TableRequestResult>(() =>
      request(queryUrl, {
        method: 'Post',
      }),
    );
  }
};
interface TreeTableParams {
  url: string;
  params?: object;
}

export const treeTableCommonRequeset = <T>(data: TreeTableParams) => {
  const { url, params = {} } = data;
  return cyRequest<T[]>(() => request(`${baseUrl.project}${url}`, { method: 'GET', params }));
};
