import request from '@/utils/request'
import JsonP from 'jsonp'
import noTokenRequest from 'umi-request'
// import { webConfig } from '../../../public/config/request';
import { baseUrl, geoServeUrl } from '../common'
import { cyRequest } from './../common'
// const ip = window.location.hostname;

// const wfsBaseURL = `http://${webConfig.geoServerIP}${webConfig.geoServerPort}/geoserver/pdd/ows`;
const wfsBaseURL = geoServeUrl

export interface ProjectList {
  id: string
  time?: string // '2021-04-19'
  status?: number
  engineerId: string
  isExecutor?: boolean
}

// 获取地图资源
export const getMapList = (params: any) => {
  return noTokenRequest('https://bbgl.gczhyun.com/common/api/Map/GetList', {
    method: 'POST',
    data: { ...params },
  })
}

// 获取地图资源
export const getUseFulMapList = (params: any) => {
  return noTokenRequest('https://bbgl.gczhyun.com/common/api/Map/getUseFulList', {
    method: 'POST',
    data: { ...params },
  })
}

//获取自定义地图源下拉选项
export const getCustomMapList = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.project}/MapSourceConfig/GetList`, {
      method: 'POST',
      data: params,
    })
  )
}

// 有些想要展示的字段需要通过接口进行查询
// let parmas = {
//   'companyId': feature.getProperties().company === undefined ? null : feature.getProperties().company,
//   'projectId': feature.getProperties().project_id === undefined ? null : feature.getProperties().project_id,
//   'recordId': feature.getProperties().recorder === undefined ? null : feature.getProperties().recorder,
//   'surveyId': feature.getProperties().surveyor === undefined ? null : feature.getProperties().surveyor,
//   'mainId': feature.getProperties().main_id === undefined ? null : feature.getProperties().main_id,
//   'pullLineId': feature.getId().split('.')[1]
// }
export const getGisDetail = (params: any) => {
  return request(`${baseUrl.common}/System/GetGisDetail`, { method: 'POST', data: { ...params } })
}

// 消息推送
export const publishMessage = (params: any) => {
  return request(`${baseUrl.design}/WebGis/PublishMessage`, {
    method: 'POST',
    data: { ...params },
  })
}

//获取单个户表入户线信息
export const getHouseholdLineInfo = (params: any) => {
  return request(`${baseUrl.manage}/WebGis/GetHomeLines`, {
    method: 'GET',
    params,
  })
}

//获取附加材料表信息
export const getAdditionalMaterials = (params: any) => {
  return request(`${baseUrl.manage}/WebGis/GetAdditionalMaterials`, {
    method: 'GET',
    params,
  })
}

//附加材料表获取物料信息
export const getAdditionalDetails = (params: any) => {
  return request(`${baseUrl.resourceV1}/LibraryMaterial/GetMaterialById`, {
    method: 'POST',
    data: params,
  })
}

//获取公司库id
export const getCompanyLibInfo = (params: {
  status: number
  libType: number
  libSource: string
}) => {
  return request(`${baseUrl.resource}/ResourceLib/GetList`, { method: 'GET', params })
}

// 获取材料表数据
export const getMaterialItemData = (params: any) => {
  /**
   * @type  判断图层名称
   *        默认值为1，表示非tower图层
   *        当图层是tower时,type 为0
   */
  let { type = 0, ...rest } = params
  if (params.layerName !== 'tower') type = 1
  if (params.layerName === 'cable_channel') type = 2
  const url = [
    '/LibraryDesign/GetModuleDetailView',
    '/LibraryComponent/GetComponentDetailView',
    '/LibraryCable/GetCableChannelDetailView',
  ]

  return request(
    `${baseUrl.resourceV1}` + url[type],
    // 'http://10.6.1.36:8015/api/LibraryDesign/GetModuleDetailView',
    { method: 'POST', data: { ...rest } }
  )
}
// 获取材料表数据和附加材料表数据
export const GetDesignResultMaterial = (params: any) => {
  return request(`${baseUrl.design}/Resource/GetDesignResultMaterial`, {
    method: 'POST',
    data: params,
  })
}
// 获取多媒体数据
export const getMedium = (params: any) => {
  return request(`${baseUrl.design}/WebGis/GetMedias`, { method: 'POST', data: { ...params } })
}

// 获取资源库id
export const getlibId_new = (params: any) => {
  return request(`${baseUrl.project}/Porject/GetLibId`, { method: 'GET', params })
}

export const getlibId = (params: any) => {
  return request(`${baseUrl.manage}/WebGis/GetProjectById`, { method: 'GET', params })
}

export const getModulesRequest = (params: any) => {
  return request(`${baseUrl.resourceV1}/LibraryDesign/GetTowerModuleList`, {
    method: 'POST',
    data: { ...params },
  })
}

//
export const getModuleDetailView = (params: any) => {
  return request(`${baseUrl.resourceV1}/LibraryDesign/GetModuleDetailView`, {
    method: 'POST',
    data: { ...params },
  })
}

// 加载图层模板
function format(that: any, ...args: any) {
  let result = that
  if (args.length < 1) {
    return result
  }
  var data = arguments
  if (args.length == 1 && typeof args[0] === 'object') {
    data = args[0]
  }
  for (var key in data) {
    var value = data[key]
    if (undefined != value) {
      result = result.replace('{' + key + '}', value)
    }
  }
  return result
}

export const loadLayer: any = (postData: any, layerName: any) => {
  return request(wfsBaseURL, { method: 'POST', data: format(postData, { '0': layerName }) })
}

// FindLineDetailInfo线条
export const findLineDetailInfo = (params: any) => {
  return request(`${baseUrl.manage}/WebGis/FindLineDetailInfo`, {
    method: 'POST',
    data: { ...params },
  })
}

export const getMediaSign = (params: any) => {
  return request(`${baseUrl.manage}/WebGis/GetProjectMediaTags`, {
    method: 'POST',
    data: { ...params },
  })
}

// 定位当前用户位置；调用的是百度定位api
export const initIpLocation = () => {
  //request('/baidu/api?qt=ipLocation&t=' + new Date().getTime());
  return new Promise((resolve, reject) => {
    JsonP(
      `https://map.baidu.com?qt=ipLocation&t=${new Date().getTime()}`,
      {},
      function (err: any, res: any) {
        if (res) {
          resolve(res)
        } else {
          reject(err)
        }
      }
    )
  })
}

// 加载项目中所需的枚举
export const loadEnums = (params: any = {}) => {
  return request(`${baseUrl.common}/System/GetEnums`, { method: 'POST', data: { ...params } })
}

// 获取穿孔信息
export interface CableSectionProps {
  layerType: 1 | 2
  holeId: string
  arrangement: string | null
  layMode: number
  title: string
}
export const findHoleDetails = (params: { layerType: 1 | 2; holeId: string }) => {
  return request(`${baseUrl.design}/ProjectDesign/FindHoleDetails`, { method: 'GET', params })
}

export const getDesignMaterialModifyList = (params: any = {}) => {
  return request(`${baseUrl.manage}/WebGis/GetDesignMaterialModifyList`, {
    method: 'POST',
    data: { ...params },
  })
}

// 获取地图数据
export const getData = (params: any = {}) => {
  return request(`${baseUrl.project}/WebGis/GetData`, {
    method: 'POST',
    data: { ...params },
  })
}

// 获取项目范围
export const getExtent = (params: any = {}) => {
  return request(`${baseUrl.project}/WebGis/GetMapRegion`, {
    method: 'POST',
    data: { ...params },
  })
}

// 根据id获取要素
export const getDynamicDetail = (params: any = {}) => {
  return request(`${baseUrl.manage}/WebGis/GetDynamicDetai`, {
    method: 'GET',
    params,
  })
}
