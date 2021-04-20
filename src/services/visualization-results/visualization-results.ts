import request from '@/utils/request';
import JsonP from 'jsonp';

var ip = '171.223.214.154';
const webConfig = {
  satelliteServerIP: ip,
        satelliteServerPort: ':8020',
        geoServerIP: ip,
        geoServerPort: ':8099',
        manageSideInteractiveServiceServerIP: ip,
        manageSideInteractiveServiceServerPort: ':8025',
        manageSideInteractiveServiceServerIP_V2: ip,
        manageSideInteractiveServiceServerPort_V2: ':8026',
        designSideInteractiveServiceServerIP: ip,
        designSideInteractiveServiceServerPort: ':8014',
        publicServiceServerIP: ip,
        publicServiceServerPort: ':8022',
        engineeringBusinessServiceServerIP: ip,
        engineeringBusinessServiceServerPort: ':8013',
        fileStorageServiceServerIP: ip,
        fileStorageServiceServerPort: ':8023',
        resourceServiceServerIP: ip,
        resourceServiceServerPort: ':8015',
        webSocketIP: ip,
        webSocketPort: ':8032'
};

export interface ProjectList {
  id: string;
  time?: string;   // '2021-04-19'
  status?: string
}

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
function format (that: any, ...args: any) {
      let result = that;
      if (args.length < 1) {
          return result;
      }
      var data = arguments;
      if (args.length == 1 && typeof (args[0]) == "object") {
          data = args[0];
      }
      for (var key in data) {
          var value = data[key];
          if (undefined != value) {
              result = result.replace("{" + key + "}", value);
          }
      }
      return result;
}
export const loadLayer: any = (url: any, postData: any, layerName: any) => {
  return request(url, { method: "POST", data: format(postData, {'0': layerName})})
}

// FindLineDetailInfo线条
export const findLineDetailInfo = (params: any) => {
  return request(`http://${webConfig.manageSideInteractiveServiceServerIP}${webConfig.manageSideInteractiveServiceServerPort}/api/WebGis/FindLineDetailInfo`, { method: 'POST', data: {...params}})
}

// 定位当前用户位置；调用的是百度定位api
export const initIpLocation = () => {
  //request('/baidu/api?qt=ipLocation&t=' + new Date().getTime());
  return new Promise((resolve, reject) => {
    JsonP(`https://map.baidu.com?qt=ipLocation&t=${new Date().getTime()}`,{},function(err: any,res: any){
      if(res) {
        resolve(res)
      }else {
        reject(err)
      }
    })
  })
}

// 加载项目中所需的枚举
export const loadEnums = (params: any ={}) => {
  request(`http://${webConfig.publicServiceServerIP}${webConfig.publicServiceServerPort}/api/System/GetEnums`, { method: 'POST' , data: {...params}})
}