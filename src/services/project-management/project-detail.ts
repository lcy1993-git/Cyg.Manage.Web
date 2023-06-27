import request from '@/utils/request'

import { cyRequest, baseUrl } from '../common'
import { TableRequestResult } from '../table'

// 获取明细表
export const getProjectDesignData = (params: any) => {
  return cyRequest<TableRequestResult>(() =>
    request(`${baseUrl.project}/ProjectDesignData/GetConstructEffect`, {
      method: 'POST',
      data: params,
    })
  )
}

//导出明细表
export const epxortConstructEffect = (params: any) => {
  return request(`${baseUrl.project}/ProjectDesignData/ExportConstructEffect`, {
    method: 'POST',
    data: params,
    responseType: 'blob',
  })
}
