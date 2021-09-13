import Feature from "ol/Feature";

import { ProjectList } from '@/services/visualization-results/visualization-results';

import { Properties } from '@/services/visualization-results/side-tree';

import { line_style, zero_guy_style } from './localData/pointStyle';
import LineString from "ol/geom/LineString";

/**
 * 用于描述两个点位之间由多条线组成的线簇
 */
export class LineCluster {
  constructor(id: number, start_id: string, end_id: string, lines: Feature[], zero_guys: Feature[]) {
    this.id = id;
    this.start_id = start_id;
    this.end_id = end_id;
    this.lines = lines;
    this.zero_guys = zero_guys;
    this.targetTopLine = new Feature();
    this.targetBottomLine = new Feature();

    // 初始化要素的标注的显示控制量
    if(lines.length > 0) {
      lines[0].setProperties({
        showLengthLabel: true,
      });
      this.targetTopLine = lines[0];
      this.targetBottomLine = lines[0];
    }
    else if (zero_guys.length > 0) {
      zero_guys[0].setProperties({
        showLengthLabel: true,
      });
      this.targetTopLine = zero_guys[0];
      this.targetBottomLine = zero_guys[0];
    }
  }
  /**
   * 线簇id
   */
  id: number;
  /**
   * 起点id
   */
  start_id: string;
  /**
   * 终点id
   */
  end_id: string;
  /**
   * 架空线路
   */
  lines: Feature[];
  /**
   * 水平拉线
   */
  zero_guys: Feature[];
  /**
   * 线簇最上面的要素，用于显示线簇长度标注
   */
  targetTopLine: Feature;
  /**
   * 线簇最下面的要素，用于在小比例尺下显示线路型号
   */
   targetBottomLine: Feature;
  /** 
   * 判断该线是否应该包含该线段
   * @param feature 线要素
   * @returns 该线是否应该包含该线段
  */
  isShouldContainLine(feature: Feature) {
    let props = feature.getProperties();
    if(props.start_id === this.start_id && props.end_id === this.end_id) {
      return true;
    }
    return false;
  }
  /**
   * 向线簇添加线要素
   * @param feature 线要素
   * @param lineType 线要素类型(line、zero_guy、cable_channel)
   */
  insertLine(feature: Feature, lineType: string) {
    if(this.isShouldContainLine(feature)) {
      switch(lineType) {
        case 'line': 
          let isExsit = false;
          for (let i = 0; i < this.lines.length; i++) {
            let lineId = this.lines[i].getProperties().id;
            let featureId = feature.getProperties().id;
            if(lineId === featureId) {
              isExsit = true;
              // 覆盖已存在的线
              this.lines[i] = feature;
            }
          }
          if(!isExsit) {
            this.lines.push(feature);
          }
          break;
        case 'zero_guy':
          isExsit = false;
          for (let i = 0; i < this.zero_guys.length; i++) {
            let lineId = this.zero_guys[i].getProperties().id;
            let featureId = feature.getProperties().id;
            if(lineId === featureId) {
              isExsit = true;
              // 覆盖已存在的线
              this.zero_guys[i] = feature;
            }
          }
          if(!isExsit) {
            this.zero_guys.push(feature);
          }
          this.zero_guys.push(feature);
          break;
      }
    }
  }
  /**
   * 更新线簇中所有要素的标注的显示控制量
   */
  updateLabelControlValue(showAllLabel: boolean) {
    // 线簇最上面的要素
    let targetTopIndex = 0;
    // 线簇最上面的要素类型
    let targetTopType = 'line';
    // 线簇最下面的要素
    let targetBottomIndex = 0;
    // 线簇最下面的要素类型
    let targetBottomType = 'line';
    if(this.lines.length > 0) {
      this.targetTopLine = this.lines[0];
      this.targetBottomLine = this.lines[0];
      for (let index = 0; index < this.lines.length; index++) {
        const line = this.lines[index];
        let targetTopCoords = (this.targetTopLine.getGeometry() as LineString).getCoordinates();
        let targetBottomCoords = (this.targetBottomLine.getGeometry() as LineString).getCoordinates();
        let lineCoords = (line.getGeometry() as LineString).getCoordinates();
        // 找到最顶部的线
        if(targetTopCoords[0][1] < lineCoords[0][1]) {
          targetTopIndex = index;
          targetTopType = 'line';
          this.targetTopLine = line;
        }
        
        // 展示全部要素的型号label
        if (showAllLabel) {
          line.setProperties({showLabel: true});
          line.setStyle(line_style(line));
        }
        // 找到最底部的线，仅显示该线的型号label
        else if (targetBottomCoords[0][1] > lineCoords[0][1]) {
          targetBottomIndex = index;
          targetBottomType = 'line';
          this.targetBottomLine = line;
        }

        // 不展示全部线路的型号label，则先关闭所有线路的型号label显示开关
        if (!showAllLabel) {
          line.setProperties({showLabel: false});
          line.setStyle(line_style(line));
        }
      }
    }

    if(this.zero_guys.length > 0) {
      this.targetTopLine = this.zero_guys[0];
      this.targetBottomLine = this.zero_guys[0];
      for (let index = 0; index < this.zero_guys.length; index++) {
        const line = this.zero_guys[index];
        let targetTopCoords = (this.targetTopLine.getGeometry() as LineString).getCoordinates();
        let targetBottomCoords = (this.targetBottomLine.getGeometry() as LineString).getCoordinates();
        let lineCoords = (line.getGeometry() as LineString).getCoordinates();
        // 找到最顶部的线
        if(targetTopCoords[0][1] < lineCoords[0][1]) {
          targetTopIndex = index;
          targetTopType = 'zero_guy';
          this.targetTopLine = line;
        }
        // 展示全部要素的型号label
        if (showAllLabel) {
          line.setProperties({showLabel: true});
          line.setStyle(zero_guy_style(line));
        }
        // 找到最底部的线，仅显示该线的型号label
        else if (targetBottomCoords[0][1] > lineCoords[0][1]) {
          targetBottomIndex = index;
          targetBottomType = 'line';
          this.targetBottomLine = line;
        }

        // 不展示全部线路的型号label，则先关闭所有线路的型号label显示开关
        if (!showAllLabel) {
          line.setProperties({showLabel: false});
          line.setStyle(zero_guy_style(line));
        }
      }
    }

    // 设置线簇长度标识
    if(targetTopType === 'line') {
      if(!this.lines[targetTopIndex]) {
        return;
      }
      this.lines[targetTopIndex].setProperties({
        showLengthLabel: true,
      });
      // 设置样式
      this.lines[targetTopIndex].setStyle(line_style(this.lines[targetTopIndex])); 
    }
    // 水平拉线
    else {
      if(!this.zero_guys[targetTopIndex]) {
        return;
      }
      this.zero_guys[targetTopIndex].setProperties({
        showLengthLabel: true,
      });
      // 设置样式
      this.zero_guys[targetTopIndex].setStyle(zero_guy_style(this.zero_guys[targetTopIndex]));
    }

    // 仅显示最下面的型号label
    if(!showAllLabel) {
      // 设置线路型号标注
      if(targetBottomType === 'line') {
        if(!this.lines[targetBottomIndex]) {
          return;
        }
        this.lines[targetBottomIndex].setProperties({
          showLabel: true,
        });
        // 设置样式
        this.lines[targetBottomIndex].setStyle(line_style(this.lines[targetBottomIndex])); 
      }
      // 水平拉线
      else {
        if(!this.zero_guys[targetBottomIndex]) {
          return;
        }
        this.zero_guys[targetBottomIndex].setProperties({
          showLabel: true,
        });
        // 设置样式
        this.zero_guys[targetBottomIndex].setStyle(zero_guy_style(this.zero_guys[targetBottomIndex]));
      }
    }
    
  }
}

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

/**
 * 将同一线段上的非水平拉线的标注文本绘制到该段左侧，将水平拉线的标注文本绘制到该段右侧
 * 
 * @param feature 
 * @returns 
 */
export const getTextPositionOfLine = (feature: Feature) => {

}