import Feature from "ol/Feature";

import { ProjectList } from '@/services/visualization-results/visualization-results';

export const getTime = (t: any) => {
  return new Date(t.replaceAll('/','-')).getTime();
}

/**
 * 获取xml数据
 * @param projects 选中的项目集合
 * @param propTime 时间
 * @returns xml文本 STRING
 */
export const getXmlData = (projects: ProjectList[], propTime: string | undefined) => {
  const postData = projects.reduce((pre, { id, time }) => {
    let value = "";
    if(!time || !propTime || getTime(propTime) >= getTime(time)) {
      value = "<PropertyIsEqualTo><PropertyName>project_id</PropertyName><Literal>" + id + "</Literal></PropertyIsEqualTo>"
    }
    return pre + value
  }, "");
  return getBaseXmlData(postData);
}

export const getCustomXmlData = (name: string, vlaue: any) => {
  const postData = `<PropertyIsEqualTo><PropertyName>${name}</PropertyName><Literal>${vlaue}</Literal></PropertyIsEqualTo>`;
  return getBaseXmlData(postData);
}

const getBaseXmlData = (postData: string) => {
  const head = `<?xml 
                  version='1.0' encoding='GBK'?><wfs:GetFeature service='WFS' version='1.0.0' 
                  outputFormat='JSON' xmlns:wfs='http://www.opengis.net/wfs' xmlns:ogc='http://www.opengis.net/ogc' 
                  xmlns:gml='http://www.opengis.net/gml' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' 
                  xsi:schemaLocation='http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd'>
                  <wfs:Query typeName='{0}' srsName='EPSG:4326'><ogc:Filter><Or>`;
  const end = "</Or></ogc:Filter></wfs:Query></wfs:GetFeature>";
  return head + postData + end;
}

// 时间排序 优化方案
export const sortByTime = (arr: any[]) => {
  if(arr.length < 5) {
    return arr.sort((a: any, b: any) => {
      // @ts-ignore
      return (new Date(a.properties.record_dateg)).getTime() - (new Date(b.properties.record_date)).getTime();
    })
  } else {
    return arr.map((item: Feature | any) => {
      return {
        t: (new Date(item.properties.record_dateg)).getTime(),
        v: item
      }
    })
    // @ts-ignore
    .sort((a, b) => a.t - b.t).map((item) => item.v)
  }
}

// 格式化输出时间
export const format = (fmt: string, date: Date) => { //author: meizz 
  var o = {
      "M+": date.getMonth() + 1, //月份 
      "d+": date.getDate(), //日 
      "h+": date.getHours(), //小时 
      "m+": date.getMinutes(), //分 
      "s+": date.getSeconds(), //秒 
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
      "S": date.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}