import { getStyle } from './style'
/**
 * 加载点位，自定义样式
 * @param map 地图对象
 * @param imageUrl 图标url
 * @param id 图层ID
 * @param features 数据集合
 */
export const addIcon = (map: any, imageUrl: any, id: string, features: any) => {
  const imageId = id + '_poi'
  //画图片点，需要先加载图片 图片路径在页面部署在服务上时可以用相对路径
  map.loadImage(imageUrl, (error: any, image: any) => {
    //添加图片到map，第一个参数为图片设置id
    map.addImage(imageId, image)
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
      layout: {
        // 为图层设置引用的图片ID
        'icon-image': imageId,
        'icon-size': 1,
        'icon-ignore-placement': true,
      },
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
      'circle-radius': 10,
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
export const addLine = (map: any, id: string, features: any, color: string) => {
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
      'line-color': color,
      'line-width': 4,
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
  let groups: any, field: string, style: any
  if (type === 'tower') {
    field = 'symbol_id'
    groups = sortDatas(datas, field)
  }

  Object.keys(groups).forEach((item: any) => {
    const data = groups[item]
    const features = data.map((element: any) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [element.lon, element.lat],
        },
        properties: element,
      }
    })
    style = getStyle(type, item)
    addCircle(map, `${layerType}_${type}_${type}`, features, style)
  })
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
