import { getAzimuth, getStyle } from './style'
import { wktToGeometry } from './utils'
/**
 * 加载点位，自定义样式
 * @param map 地图对象
 * @param imageUrl 图标url
 * @param id 图层ID
 * @param features 数据集合
 */
var layout = {}
export const addIcon = (map: any, imageUrl: any, id: string, features: any) => {
  const imageId = id + '_poi'
  //画图片点，需要先加载图片 图片路径在页面部署在服务上时可以用相对路径
  map.loadImage(imageUrl, (error: any, image: any) => {
    //添加图片到map，第一个参数为图片设置id
    map.addImage(imageId, image)
    layout = {}
    layout['icon-image'] = imageId
    layout['icon-size'] = 0.5
    layout['icon-ignore-placement'] = true
    layout['icon-rotate'] = ['get', 'azimuth_']
    if (id.includes('pullLine')) {
      layout['icon-offset'] = [0, 20]
      layout['icon-size'] = 1
    }
    map.addLayer({
      id: id,
      type: 'symbol',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: features,
        },
      },
      layout,
    })
  })
}

/**
 * 加载点位，圆点样式
 * @params map: 地图对象
 * @params id: 图层ID, 例如： tower_G
 * @params features: 数据集合
 * @params color: 点位颜色
 **/
export const addCircle = (map: any, id: string, features: any[], color: string) => {
  map.addLayer({
    id,
    type: 'circle',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    },
    paint: {
      // 圆半径
      'circle-radius': 15,
      // 圆颜色
      'circle-color': color,
      // 圆环颜色
      'circle-stroke-color': '#4aabf7',
      // 圆环宽度
      'circle-stroke-width': 3,
    },
  })
}

/**
 * 加载线路
 * @params map: 地图对象
 * @params id: 线路图层ID
 * @params features: 数据集合
 * @params color:
 * */
export const addLine = (map: any, id: string, features: any) => {
  map.addLayer({
    id,
    type: 'line',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': ['get', 'line-color'],
      'line-width': ['get', 'line-width'],
      'line-dasharray': ['get', 'line-dasharray'],
    },
  })
}

/**
 * 加载点位
 * @param map 地图对象
 * @param type 点位类型
 * @param datas 点位数据集合
 */
export const addPoint = (map: any, layerType: string, type: string, datas: any) => {
  let groups = {},
    field: string,
    style: any
  if (type === 'tower' || type === 'cable' || type === 'cableEquipment' || type === 'transformer') {
    field = 'symbol_id'
    groups = sortDatas(datas, field)
  } else if (type === 'faultIndicator') {
    field = 'state'
    groups = sortDatas(datas, field)
  } else if (type === 'mark' || type === 'pullLine') {
    field = 'type'
    groups = sortDatas(datas, field)
  } else if (type === 'hole' || type === 'brace') {
    groups[type] = datas
  } else if (type === 'electricMeter' || type === 'crossArm') {
    groups = sortDatas_(datas, 'type', 'state')
  } else if (type === 'overHeadDevice') {
    groups = sortDatas_(datas, 'state', 'type')
  } else if (type === 'cableHead') {
    sortDatas__(datas, 'type', 'state', 'kv_level')
  } else if (type === 'cableChannel' || type === 'line' || type === 'userLine') {
    addLineString(map, layerType, type, datas)
    return
  }

  groups &&
    Object.keys(groups).forEach((item: any) => {
      const data = groups[item]
      const features = data.map((element: any) => {
        // if (element.azimuth) {
        //   element.azimuth_ = (element.azimuth + 90) * -1
        // } else {
        //   element.azimuth_ = 0
        // }
        element.azimuth_ = getAzimuth(type, element.azimuth)
        const obj: any = wktToGeometry(element.sj_geom)
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: obj?.lngLats[0],
          },
          properties: element,
        }
      })
      style = getStyle(type, item)

      if (map.getLayer(`${layerType}_${type}_${item}`)) {
        map.getSource(`${layerType}_${type}_${item}`).setData({
          type: 'FeatureCollection',
          features: features,
        })
      } else {
        addIcon(map, style, `${layerType}_${type}_${item}`, features)
      }
    })
}

export const addLineString = (map: any, layerType: string, type: string, datas: any) => {
  let features: any = []
  datas.forEach((data: any) => {
    switch (type) {
      case 'cableChannel':
        data['line-color'] = '#3A2E46'
        data['line-width'] = 6
        data['line-dasharray'] = [1]
        break
      case 'subLine':
        data['line-color'] = '#00BFFF'
        data['line-width'] = 2
        data['line-dasharray'] = [2, 2]
        break
      case 'line':
      case 'userLine':
        data['line-color'] = getLineColor(data.symbol_id)
        data['line-width'] = 4
        data['line-dasharray'] = getLineDash(data.symbol_id)
        break

      default:
        break
    }

    let obj: any = wktToGeometry(data.sj_geom)
    let feature = {
      type: 'Feature',
      geometry: {
        type: obj.type,
        // lineString类型的几何对象为2层数组，MultiLineString类型为3层数组
        coordinates: obj.lngLats,
      },
      properties: data,
    }
    features.push(feature)
  })
  if (map.getLayer(`${layerType}_${type}`)) {
    map.getSource(`${layerType}_${type}`).setData({
      type: 'FeatureCollection',
      features: features,
    })
  } else {
    addLine(map, `${layerType}_${type}`, features)
  }
}

/**
 * 将数据集合进行分类
 * @param datas 数据集合
 * @param field 分类字段
 */
const sortDatas = (datas: any, field: string) => {
  const groups = {}
  for (const data of datas) {
    if (groups[data[field]]) {
      groups[data[field]].push(data)
    } else {
      groups[data[field]] = [data]
    }
  }
  return groups
}

/**
 * 将数据集合进行分类
 * @param datas 数据集合
 * @param field1 分类字段1
 * @param field2 分类字段2
 * @returns
 */
const sortDatas_ = (datas: any, field1: string, field2: string) => {
  const groups = {}
  for (const data of datas) {
    if (groups[`${data[field1]}_${data[field2]}`]) {
      groups[`${data[field1]}_${data[field2]}`].push(data)
    } else {
      groups[`${data[field1]}_${data[field2]}`] = [data]
    }
  }
  return groups
}

/**
 * 将数据集合进行分类
 * @param datas 数据集合
 * @param field1 分类字段1
 * @param field2 分类字段2
 * @param field3 分类字段3
 * @returns
 */
const sortDatas__ = (datas: any, field1: string, field2: string, field3: string) => {
  const groups = {}
  for (const data of datas) {
    if (groups[`${data[field1]}_${data[field2]}_${data[field3]}`]) {
      groups[`${data[field1]}_${data[field2]}_${data[field3]}`].push(data)
    } else {
      groups[`${data[field1]}_${data[field2]}_${data[field3]}`] = [data]
    }
  }
  return groups
}

/**
 * 获取线路颜色
 * @param symbol_id
 */
const getLineColor = (symbol_id: number) => {
  let color = '#9191FF'
  switch (symbol_id) {
    case 1011:
    case 1021:
    case 1031:
    case 1041:
    case 1111:
    case 1121:
    case 1131:
    case 1141:
      color = '#9191FF'
      break

    case 1012:
    case 1022:
    case 1032:
    case 1042:
    case 1112:
    case 1122:
    case 1132:
    case 1142:
      color = '#60D71A'
      break

    case 1013:
    case 1023:
    case 1033:
    case 1043:
    case 1113:
    case 1123:
    case 1133:
    case 1143:
      color = '#00FFD8'
      break

    case 1014:
    case 1024:
    case 1034:
    case 1044:
    case 1114:
    case 1124:
    case 1134:
    case 1144:
      color = '#FFAF6E'
      break

    default:
      break
  }
  return color
}

/**
 * 获取是否虚线
 * @param symbol_id
 * @returns
 */
const getLineDash = (symbol_id: number) => {
  let lineDash = [1]
  if (
    symbol_id === 1021 ||
    symbol_id === 1022 ||
    symbol_id === 1023 ||
    symbol_id === 1024 ||
    symbol_id === 1031 ||
    symbol_id === 1033 ||
    symbol_id === 1033 ||
    symbol_id === 1034 ||
    symbol_id === 1121 ||
    symbol_id === 1123 ||
    symbol_id === 1123 ||
    symbol_id === 1124 ||
    symbol_id === 1131 ||
    symbol_id === 1133 ||
    symbol_id === 1133 ||
    symbol_id === 1134
  ) {
    lineDash = [2, 2]
  }
  return lineDash
}
