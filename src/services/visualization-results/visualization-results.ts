import request from '@/utils/request';

// 获取地图资源
export const getMapList = (params: any) => {
  return request("http://service.pwcloud.cdsrth.com:8101/api/Map/GetList", { method: 'POST', data: {...params}});
}
