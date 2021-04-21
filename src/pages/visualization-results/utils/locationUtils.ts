/**
 * wgs84 地心坐标系 GPS原始知坐标体系。在中国，任何一个地图产品都不允许使用GPS坐标，据说是为了保密。GoogleEarth及GPS芯片使用
 * bd09 百度
 * gcj02 火星坐标系 高德、腾讯、Google中国地图使用
 */ 
 var PI = 3.14159265358979324
 var x_pi = PI * 3000.0 / 180.0;
 const transformLat = (x:number, y:number) => {
   var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
   ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
   ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0
   ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0
   return ret
 }
 const transformLon = (x:number, y:number) => {
   var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
   ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
   ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0
   ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0
   return ret
 }
 const locationDelta = (lon:number, lat:number) => {
   var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
   var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
   var dLat = transformLat(lon - 105.0, lat - 35.0)
   var dLon = transformLon(lon - 105.0, lat - 35.0)
   var radLat = lat / 180.0 * PI
   var magic = Math.sin(radLat)
   magic = 1 - ee * magic * magic
   var sqrtMagic = Math.sqrt(magic)
   dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI)
   dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI)
   return [dLon, dLat]
 }
  
 const gcj02Towgs84 = (lng:number, lat:number) => {
    var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
   var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
   var lat = +lat;
   var lng = +lng;
   var dlat = transformLat(lng - 105.0, lat - 35.0);
   var dlng = transformLon(lng - 105.0, lat - 35.0);
   var radlat = lat / 180.0 * PI;
   var magic = Math.sin(radlat);
   magic = 1 - ee * magic * magic;
   var sqrtmagic = Math.sqrt(magic);
   dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
   dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
   var mglat = lat + dlat;
   var mglng = lng + dlng;
   return [lng * 2 - mglng, lat * 2 - mglat]
 }
  
 const gcj02Tobd09 = (lon:number, lat:number) => {
   var x = lon
   var y = lat
   var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi)
   var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi)
   var bdLon = z * Math.cos(theta) + 0.0065
   var bdLat = z * Math.sin(theta) + 0.006
   return [bdLon, bdLat]
 }
  
 const bd09Towgs84 = (lng:number, lat:number) => {
   let bd09ToGcj02Location = bd09Togcj02(lng, lat)
   let gcj02towgs84Location =  gcj02Towgs84(bd09ToGcj02Location[0], bd09ToGcj02Location[1])
  
   return gcj02towgs84Location
 }
    
 const bd09Togcj02 = (bdLon:number, bdLat:number) => {
   var x = bdLon - 0.0065
   var y = bdLat - 0.006
   var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
   var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
   var gcjLon = z * Math.cos(theta);
   var gcjLat = z * Math.sin(theta)
   return [gcjLon, gcjLat]
 }
  
 const wgs84Togcj02 = (lon:number, lat:number) => {
   var lat = +lat;
   var lon = +lon;
   var d = locationDelta(lon, lat);
   return [lon + d[0], lat + d[1]]
 }
 const wgs84Tobd09 = (lon:number, lat:number) => {
   var lat = +lat;
   var lon = +lon;
   let gcj02 = wgs84Togcj02(lon, lat)
   return gcj02Tobd09(gcj02[0], gcj02[1])
 }

 export {
    wgs84Tobd09,
    wgs84Togcj02,
    bd09Togcj02,
    bd09Towgs84,
    gcj02Tobd09,
    gcj02Towgs84
  };
 