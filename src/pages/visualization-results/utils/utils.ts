import Feature from "ol/Feature";

import { ProjectList } from '@/services/visualization-results/visualization-results';

import { Properties } from '@/services/visualization-results/side-tree';

export const getTime = (t: any) => {
  return new Date(t.replaceAll('/', '-')).getTime();
}

/**
 * 获取xml数据
 * @param projects 选中的项目集合
 * @param propTime 时间
 * @returns xml文本 STRING
 */
export const getXmlData = (projects: ProjectList[], startDate: string | undefined, endDate: string | undefined) => {
  const postData = '<Or>' + projects.reduce((pre, { id, time }) => {
    let value = "";
    if (time) {
      if (!startDate && !endDate) {
        value = "<PropertyIsEqualTo><PropertyName>project_id</PropertyName><Literal>" + id + "</Literal></PropertyIsEqualTo>"
      } else if (!startDate && endDate) {
        if (getTime(endDate) >= getTime(time)) {
          value = "<PropertyIsEqualTo><PropertyName>project_id</PropertyName><Literal>" + id + "</Literal></PropertyIsEqualTo>"
        }
      } else if (startDate && !endDate) {
        if (getTime(startDate) <= getTime(time)) {
          value = "<PropertyIsEqualTo><PropertyName>project_id</PropertyName><Literal>" + id + "</Literal></PropertyIsEqualTo>"
        }
      } else {
        if (getTime(startDate) <= getTime(time) && getTime(endDate) >= getTime(time)) {
          value = "<PropertyIsEqualTo><PropertyName>project_id</PropertyName><Literal>" + id + "</Literal></PropertyIsEqualTo>"
        }
      }
    } else {
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
  if (arr.length < 5) {
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

export interface TreeNodeType {
  title: string;
  key: string;
  id: string;
  levelCategory: number;
  engineerId?: string;
  parentId?: string;
  propertys?: Properties;
  children?: TreeNodeType[];
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
export const flattenDeepToKey = (data: TreeNodeType[], deep: number, key: string, root: number | string) => {

  let resData = root ? [root] : [];

  if (deep === 0) return resData;
  /**
   * 深度优先遍历data,并且记忆每个层级的nodeKey
   * @param stuckFlag key层级存储栈
   */
  const recursionFn = (data: TreeNodeType[], deep: any, stuckFlag: string[] | undefined = undefined) => {
    data.forEach((item: TreeNodeType) => {
      let stuckFlagArray = Array.isArray(stuckFlag) ? [...stuckFlag, item[key]] : [item[key]];
      if (item.levelCategory === deep) {
        resData = [...resData.concat(stuckFlagArray.slice(0, -1))];
        stuckFlagArray = []
      }
      if (item.children && Array.isArray(item.children)) {
        recursionFn(item.children, deep, stuckFlagArray)
      }
    })
  }

  recursionFn(data, deep + 1);

  return Array.from(new Set(resData));
}

/**
 * 可视化当搜索时，根据搜索框条件进行选中
 * 
 * @param data 
 * @param keyWord 
 * @returns key[]
 */
export const getSelectKeyByKeyword = (data: TreeNodeType[], keyWord: string) => {
  let selectKey: string[] = [];
  const recursionFn = (data:TreeNodeType[] ) => {
    data.forEach((item) => {
      if((item.levelCategory === 5 || item.levelCategory === 6) && item.title.includes(keyWord)) {
        selectKey.push(item.key)
      }
      if (item.children && Array.isArray(item.children)) {
        recursionFn(item.children)
      }
    })
  }
  recursionFn(data);
  return Array.from(new Set(selectKey));
}