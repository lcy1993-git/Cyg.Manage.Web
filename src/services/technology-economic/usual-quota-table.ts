import request from '@/utils/request'
import { cyRequest, baseUrl } from '../common'

// // 获取费用模板目录
// export const getCostTableDirectory = (engineeringTemplateId: string) => {
//   return cyRequest(() =>
//     request(`${baseUrl.tecEco}/EngineeringTemplateCostTable/QueryEngineeringTemplateCost`,
//       { method: 'GET', params: { engineeringTemplateId } }),
//   );
// }

export interface QueryData {
  pageIndex: number
  pageSize: number
  sort: {
    propertyName: string
    isAsc: boolean
  }
  keyWord: string
}
export interface CommonlyTableForm {
  id?: string
  number: string
  commonlyTableType: number
  sourceFile: string
  publishDate: moment.Moment | string
  publishOrg: string
  year: string | moment.Moment
  industryType: number
  majorType: number
  remark: string
  enabled: boolean
}
// 查询定额常用表分页
export const queryCommonlyTablePager = (data: Partial<QueryData>) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.tecEco1}/CommonlyTable/QueryCommonlyTablePager`, { method: 'POST', data })
  )
}

// 添加定额常用表
export const addCommonlyTable = (data: CommonlyTableForm) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/CommonlyTable/AddCommonlyTable`, { method: 'POST', data })
  )
}
// 修改定额常用表
export const editCommonlyTable = (data: CommonlyTableForm) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/CommonlyTable/EditCommonlyTable`, { method: 'POST', data })
  )
}

// 获取已添加的定额常用表类型列表
export const getCommonlyTableTypeList = () => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.tecEco1}/CommonlyTable/GetCommonlyTableTypeList`, { method: 'get' })
  )
}
// 设置定额常用表状态
export const SetCommonlyTableStatus = (id: string, enabled: boolean) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.tecEco1}/CommonlyTable/SetStatus`, {
      method: 'get',
      params: { id, enabled },
    })
  )
}
// 删除
export const deleteCommonlyTable = (commonlyTableId: string) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.tecEco1}/CommonlyTable/DeleteCommonlyTable`, {
      method: 'get',
      params: {
        commonlyTableId,
      },
    })
  )
}

// 获取地形增加系数表
export const getCommonlyTableLandRatio = (rateFileId: string) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.tecEco1}/CommonlyTable/GetCommonlyTableLandRatio`, {
      method: 'get',
      params: {
        rateFileId,
      },
    })
  )
}

// 获取未计价材料施工损耗率表
export const getCommonlyTableLossRatio = (rateFileId: string) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.tecEco1}/CommonlyTable/GetCommonlyTableLossRatio`, {
      method: 'get',
      params: {
        rateFileId,
      },
    })
  )
}

// 获取所有的土方参数
export const getAllEarthWorks = (commonlyTableId: string) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.tecEco1}/Earthwork/AllEarthWorks/${commonlyTableId}`, { method: 'get' })
  )
}

// 获取所有的挖方裕度
export const getAllEarthworkMargins = (commonlyTableId: string) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.tecEco1}/Earthwork/AllEarthworkMargins/${commonlyTableId}`, {
      method: 'get',
    })
  )
}
// 获取所有的放坡系数
export const GetAllEarthworkSlopeCoefficients = (commonlyTableId: string) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.tecEco1}/Earthwork/AllEarthworkSlopeCoefficients/${commonlyTableId}`, {
      method: 'get',
    })
  )
}

// 下载文件
export const downloadFiles = (uploadFileId: string) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.upload}/Download/GetFileById?fileId=${uploadFileId}`, {
      method: 'get',
      responseType: 'blob',
    })
  )
}
