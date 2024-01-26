import request from '@/utils/request'
import { baseUrl, cyRequest } from './common'

interface TableCommonRequestParams {
  pageIndex: number
  pageSize: number
  url: string
  extraParams?: object
  requestSource: 'project' | 'common' | 'resource' | 'tecEco' | 'tecEco1' | 'grid'
  postType: 'body' | 'query'
  requestType?: 'get' | 'post'
}

export interface TableRequestResult {
  pageIndex: number
  pageSize: number
  total: number
  totalPage: number
  items: object[]
}

export const tableCommonRequest = (
  params: TableCommonRequestParams
): Promise<TableRequestResult> => {
  let requestBaseUrl = baseUrl[params.requestSource]
  if (params.requestType === 'get') {
    return cyRequest<TableRequestResult>(() =>
      request(`${requestBaseUrl}${params.url}`, {
        method: 'GET',
        params: params.extraParams,
      })
    )
  } else if (params.postType == 'body') {
    return cyRequest<TableRequestResult>(() =>
      request(`${requestBaseUrl}${params.url}`, {
        method: 'post',
        data: { ...params.extraParams, PageIndex: params.pageIndex, PageSize: params.pageSize },
      })
    )
  } else {
    const queryUrl = `${requestBaseUrl}${params.url}`
    return cyRequest<TableRequestResult>(() =>
      request(queryUrl, {
        method: 'post',
        params: params.extraParams,
      })
    )
  }
}

interface TreeTableParams {
  url: string
  params?: object
}

export const treeTableCommonRequeset = <T>(data: TreeTableParams) => {
  const { url, params = {} } = data
  return cyRequest<T[]>(() => request(`${baseUrl.project}${url}`, { method: 'GET', params }))
}
