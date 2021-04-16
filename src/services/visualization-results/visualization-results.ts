import request from '@/utils/request';

const webConfig: any = null;

// 获取地图资源
export const getMapList = (params: any) => {
  return request("http://service.pwcloud.cdsrth.com:8101/api/Map/GetList", { method: 'POST', data: {...params}});
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
  return request(`http://${webConfig.publicServiceServerIP}${webConfig.publicServiceServerPort}/api/System/GetGisDetail`, { method: 'POST', data: {...params}})
}

// 消息推送
export const getMessage = (params: any)=>{
  return request(`http://${webConfig.designSideInteractiveServiceServerIP}${webConfig.designSideInteractiveServiceServerPort}/api/WebGis/PublishMessage`, { method: 'POST', data: {...params}})
}

// 获取材料表数据 
export const getMaterialItemData = (params: any)=>{
  /**
   * @type  判断图层名称
   *        默认值为1，表示非tower图层
   *        当图层是tower时,type 为0
   */
  const {type = 1, ...rest} = params;
  const url = ['LibraryDesign/GetModuleDetailView', 'LibraryComponent/GetComponentDetailView'];
  return request(`http://${webConfig.resourceServiceServerIP}${webConfig.resourceServiceServerPort}/api/` + url[type], { method: 'POST', data: {...rest}})
}

// 获取多媒体数据
export const getMedium = (params: any) => {
  return request(`http://${webConfig.designSideInteractiveServiceServerIP}${webConfig.designSideInteractiveServiceServerPort}/api/WebGis/GetMedias`, { method: 'POST', data: {...params}})
}

// 获取资源库id
export const getlibId = (params: any) => {
  return request(`http://${webConfig.manageSideInteractiveServiceServerIP_V2}${webConfig.manageSideInteractiveServiceServerPort_V2}/api/Porject/GetById`, { method: 'GET', data: {...params}})
}

// 加载图层模板
export const loadLayer = () => {
  // 写不来
}

// FindLineDetailInfo线条
export const findLineDetailInfo = (params: any) => {
  return request(`http://${webConfig.manageSideInteractiveServiceServerIP}${webConfig.manageSideInteractiveServiceServerPort}/api/WebGis/FindLineDetailInfo`, { method: 'GET', data: {...params}})
}

// 定位当前用户位置；调用的是百度定位api
export const initIpLocation = () => {
  request('https://map.baidu.com/?qt=ipLocation&t=' + new Date().getTime())
}

// 加载项目中所需的枚举
export const loadEnums = (params: any ={}) => {
  request(`http://${webConfig.publicServiceServerIP}${webConfig.publicServiceServerPort}/api/System/GetEnums`, { method: 'POST' , data: {...params}})
}