import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

// 创建定额库
export interface AddRateTable {
  number: string
  rateTableType: number
  engineeringTemplateId: string
  publishDate: string
  publishOrg: string
  year: string
  industryType: number
  majorType: number
  remark: string
  enabled: boolean
}

export const addRateTable = (params: AddRateTable) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/RateTable/AddRateFile`, { method: 'POST', data: params })
  )
}

// 编辑定额库
export type EditRateTable = AddRateTable & { id: string }
export const editRateTable = (params: EditRateTable) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/RateTable/EditRateFile`, { method: 'POST', data: params })
  )
}

// 设置费率表状态
export const setRateTableStatus = (id: string, enabled: boolean) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/RateTable/SetStatus`, { method: 'GET', params: { id, enabled } })
  )
}

// 删除费率表
export const deleteRateTable = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/RateTable/DeleteRateFile`, { method: 'GET', params: { id } })
  )
}

// 获取工程模板下的已经添加费率类型列表
export const getRateTypeList = (rateFileId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/RateTable/GetRateTypeList`, {
      method: 'GET',
      params: { rateFileId },
    })
  )
}

// 获取简单费率详情
export const getEasyRate = (rateTableType: string, rateFileId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/RateTable/GetEasyRate`, {
      method: 'GET',
      params: { rateFileId, rateTableType },
    })
  )
}
// 获取特殊地区施工增加费费率详情
export const getSpecialAreaConstructionRate = (rateFileId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/RateTable/GetSpecialAreaConstructionRate`, {
      method: 'GET',
      params: { rateFileId },
    })
  )
}

// 获取临时设施费费率详情
export const getTemporaryFacilityRate = (rateFileId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/RateTable/GetTemporaryFacilityRate`, {
      method: 'GET',
      params: { rateFileId },
    })
  )
}
// 获取冬雨季施工增加费费率详情
export const getWinterConstructionRate = (rateFileId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/RateTable/GetWinterConstructionRate`, {
      method: 'GET',
      params: { rateFileId },
    })
  )
}
// 获取设计费费率详情
export const getDesignRate = (rateFileId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/RateTable/GetDesignRate`, { method: 'GET', params: { rateFileId } })
  )
}

// 获取基本预备费费率详情
export const getBasicReserveRate = (rateFileId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/RateTable/GetBasicReserveRate`, {
      method: 'GET',
      params: { rateFileId },
    })
  )
}

// 导入费率表
export const importRateTable = (rateFileId: string, file: File) => {
  const data = new FormData()
  data.append('file', file)
  // data.append('rateFileId', rateFileId)
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/RateTable/ImportRateTable?rateFileId=${rateFileId}`, {
      method: 'POST',
      data,
    })
  )
}
// 导入费率zip
export const ImportRateFileZip = (file: File) => {
  const data = new FormData()
  data.append('file', file)
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/RateTable/ImportRateFileZip`, {
      method: 'POST',
      data,
    })
  )
}

// 下载模板
export const downloadTemplate = (rateFileType?: number) => {
  return request(`${baseUrl.tecEco1}/RateTable/DownloadTemplate?rateFileType=${rateFileType}`, {
    method: 'GET',
    responseType: 'blob',
  })
}
// rateFileType
// 建筑安装取费表费率 = 1,
//   拆除取费表费率 = 2,
//   地形增加系数 = 3,
//   未计价材料施工损耗率 = 4,
//   土方参数 = 5,
//   社保公积金费率 = 6

// 获取拆除工程简单费率详情
export const getDemolitionEasyRate = (rateTableType: string, rateFileId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/RateTable/GetDemolitionEasyRate`, {
      method: 'GET',
      params: { rateFileId, rateTableType },
    })
  )
}

// 获取拆除工程特殊地区施工增加费费率详情
export const getDemolitionSpecialAreaConstructionRate = (rateFileId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/RateTable/GetDemolitionSpecialAreaConstructionRate`, {
      method: 'GET',
      params: { rateFileId },
    })
  )
}

// 获取拆除工程冬雨季施工增加费费率详情
export const getDemolitionWinterConstructionRate = (rateFileId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/RateTable/GetDemolitionWinterConstructionRate`, {
      method: 'GET',
      params: { rateFileId },
    })
  )
}
// 根据等级查询地区
export const queryAreaInfoList = (areaType: number) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.tecEco1}/Area/QueryAreaInfoList`, { method: 'GET', params: { areaType } })
  )
}
// 查询基础数据地区列表
export const queryBasicAreaByLevel = (
  level: number,
  parentCode: string[],
  areaType?: number,
  firstCode?: string
) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.tecEco1}/Area/QueryBasicAreaByLevel`, {
      method: 'POST',
      params: { level, parentCode, areaType, firstCode },
    })
  )
}
// 新增地区
export const createOrEditAreaInfo = (data: Record<string, any>) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.tecEco1}/Area/CreateOrEditAreaInfo`, {
      method: 'POST',
      data,
    })
  )
}

// 下载拆除模板
export const downloadDemolitionTemplate = () => {
  return request(`${baseUrl.tecEco1}/RateTable/DownloadDemolitionTemplate`, {
    method: 'GET',
    responseType: 'blob',
  })
}
// 删除等级地区
export const deleteAreaInfo = (areaType: number, firstCode: string) => {
  return request(`${baseUrl.tecEco1}/Area/DeleteAreaInfo`, {
    method: 'GET',
    params: { areaType, firstCode },
  })
}

// 查询地区等级详情
export const queryAreaInfoDetail = (areaType: number, firstCode: string) => {
  return request(`${baseUrl.tecEco1}/Area/QueryAreaInfoDetail`, {
    method: 'GET',
    params: { areaType, firstCode },
  })
}

// 导入地区分类
export const importAreaInfo = (file: File) => {
  const data = new FormData()
  data.append('file', file)
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/Area/ImportAreaInfo`, { method: 'POST', data })
  )
}

// 查询费率文件分页
export const queryRateFilePager = (data: { pageSize: number; pageIndex: number }) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/RateTable/QueryRateFilePager`, { method: 'POST', data })
  )
}
