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
  const postData = '<Or>' + projects.reduce((pre, { id, time }) => {
    let value = "";
    if(!time || !propTime || getTime(propTime) >= getTime(time)) {
      value = "<PropertyIsEqualTo><PropertyName>project_id</PropertyName><Literal>" + id + "</Literal></PropertyIsEqualTo>"
    }
    return pre + value
  }, "") + '</Or>';
  return getBaseXmlData(postData);
}

export const getCustomXmlData = (name: string, value: any) => {
    const postData = `<PropertyIsEqualTo><PropertyName>${name}</PropertyName><Literal>${value}</Literal></PropertyIsEqualTo>`;
  return getBaseXmlData(postData);
}

export const getCustomXmlDataByWhere = (postData: string) => {
  return getBaseXmlData(postData);
}

const getBaseXmlData = (postData: string) => {
  const head = `<?xml 
                  version='1.0' encoding='GBK'?><wfs:GetFeature service='WFS' version='1.0.0' 
                  outputFormat='JSON' xmlns:wfs='http://www.opengis.net/wfs' xmlns:ogc='http://www.opengis.net/ogc' 
                  xmlns:gml='http://www.opengis.net/gml' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' 
                  xsi:schemaLocation='http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd'>
                  <wfs:Query typeName='{0}' srsName='EPSG:4326'><ogc:Filter>`;
  const end = "</ogc:Filter></wfs:Query></wfs:GetFeature>";
  return head + postData + end;
}

// 时间排序 优化方案
export const sortByTime = (arr: any[]) => {
  if(arr.length < 5) {
    return arr.sort((a: any, b: any) => {
      // @ts-ignore
      return (new Date(a.properties.record_date)).getTime() - (new Date(b.properties.record_date)).getTime();
    })
  } else {
    return arr.map((item: Feature | any) => {
      return {
        t: (new Date(item.properties.record_date)).getTime(),
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

/**
 * 可视化成果层级、省市县项工可展开列方法
 * 
 * 根据数据data寻找所含deep层级的数据的相关字段key,并返回一个key组成的数组
 * @param data 数据源
 * @param deep 层级
 * @param key 字段名
 * @param root 根节点key
 * @returns key[]
 */
export const flattenDeepToKey = (data: any[], deep: number, key: string, root: number | string) => {
  let resData = root ? [root] : [];
  if(deep === 0) return resData;
  const recursionFn = (data: any, currentDeep: any) => {
    data.forEach((item: any) => {
      resData.push(item[key]);
      if(currentDeep < deep && item.children && Array.isArray(item.children)){
        recursionFn(item.children, currentDeep + 1)
      }
    })
  }
  recursionFn(data, 1);
  return resData;
}