import WKT from 'ol/format/WKT'
import { Vector } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { LINES, POINTS } from '../../DrawToolbar/GridUtils'
import { lineStyle, pointStyle } from './style'

export const loadAllLayer = (data: any, map: any) => {
  loadAllPointLayer(data, map)
  loadAllLineayer(data, map)
}

// 加载所有点图层
export const loadAllPointLayer = (data: any, map: any) => {
  let pointLayer = getLayer(map, 'pointLayer', 3, true)

  POINTS.forEach((item: any) => {
    const item_ = item[0].toLocaleLowerCase() + item.substring(1) + 'List'
    data[item_] && loadLayer(data[item_], item, pointLayer)
  })
}

// 加载所有线图层
export const loadAllLineayer = (data: any, map: any) => {
  let lineLayer = getLayer(map, 'lineLayer', 3, true)

  LINES.forEach((item: any) => {
    const item_ = item[0].toLocaleLowerCase() + item.substring(1) + 'List'
    data[item_] && loadLayer(data[item_], item, lineLayer)
  })
}

/**
 * 加载数据
 * @param ids 选择的所有id
 * @param type 点位类型
 * @param layer
 */
export const loadLayer = (data: any, type: string, layer: any) => {
  // 根据ids获取杆塔数据
  data.forEach((item: any) => {
    // 根据wkt数据格式加载feature
    let format = new WKT()
    let feature = format.readFeature(item.geom, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    })
    // 设置数据类型
    item.featureType = type
    feature.set('data', item)
    // 设置样式
    if (layer.get('name') === 'pointLayer') feature.setStyle(pointStyle(feature.get('data'), false))
    else feature.setStyle(lineStyle(feature.get('data'), false))
    // 加载数据到图层
    layer.getSource().addFeature(feature)
  })
}

export const getLayer = (map: any, layerName: string, zIndex: number, clear: boolean = false) => {
  let layer = map
    .getLayers()
    .getArray()
    .find((item: any) => item.get('name') === layerName)
  if (layer) {
    clear && layer.getSource().clear()
  } else {
    layer = new Vector({
      source: new VectorSource(),
      zIndex,
    })
    layer.set('name', layerName)
    map.addLayer(layer)
  }
  return layer
}
