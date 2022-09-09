import WKT from 'ol/format/WKT'
import { Vector } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { LINE, POINTS } from '../../DrawToolbar/GridUtils'
import { lineStyle, pointStyle } from './style'
var mapDatas: any
var checkedValues: any
export const loadAllLayer = (data: any, map: any, type: string) => {
  mapDatas = data
  loadAllPointLayer(map, POINTS, type)
  loadAllLineayer(map, type)
  locationLayer(map)
}

// 加载所有点图层
export const loadAllPointLayer = (map: any, points: any, type: string) => {
  checkedValues = points
  let pointLayer = getLayer(map, 'pointLayer', 3, true, type)
  points.forEach((item: any) => {
    const item_ = item[0].toLocaleLowerCase() + item.substring(1) + 'List'
    mapDatas[item_] && loadLayer(mapDatas[item_], item, pointLayer, map)
  })
}

export const getCheckedValues = () => {
  return checkedValues
}

// 加载所有线图层
export const loadAllLineayer = (map: any, type: string) => {
  let lineLayer = getLayer(map, 'lineLayer', 2, true, type)

  // LINES.forEach((item: any) => {
  //   const item_ = item[0].toLocaleLowerCase() + item.substring(1) + 'List'
  //   data[item_] && loadLayer(data[item_], item, lineLayer)
  // })
  mapDatas.lineRelationList && loadLayer(mapDatas.lineRelationList, LINE, lineLayer, map)
}

/**
 * 加载数据
 * @param ids 选择的所有id
 * @param type 点位类型
 * @param layer
 */
export const loadLayer = (data: any, type: string, layer: any, map: any) => {
  // 根据ids获取杆塔数据
  data.forEach((item: any) => {
    // 根据wkt数据格式加载feature
    if (item.geom) {
      let format = new WKT()
      let feature = format.readFeature(item.geom, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      })
      // 设置数据类型
      item.featureType = type
      feature.set('data', item)
      // 设置样式
      if (layer.get('name') === 'pointLayer')
        feature.setStyle(pointStyle(feature.get('data'), false, map.getView().getZoom()))
      else feature.setStyle(lineStyle(feature.get('data'), false))
      // 加载数据到图层
      layer.getSource().addFeature(feature)
    }
  })
}

export const getLayer = (
  map: any,
  layerName: string,
  zIndex: number = 99,
  clear: boolean = false,
  type: string = 'plan'
) => {
  const layerName_ = type + '_' + layerName
  const opacity = type === 'plan' ? 1 : 0.5
  let layer = map
    .getLayers()
    .getArray()
    .find((item: any) => item.get('name') === layerName_)
  if (layer) {
    clear && layer.getSource().clear()
  } else {
    layer = new Vector({
      source: new VectorSource(),
      zIndex,
      opacity,
    })
    layer.set('name', layerName)
    map.addLayer(layer)
  }
  return layer
}

export const locationLayer = (map: any) => {
  var source = new VectorSource()
  var features = []
  const pointLayer = getLayer(map, 'pointLayer')
  const lineLayer = getLayer(map, 'lineLayer')
  features = pointLayer.getSource().getFeatures()
  features = features.concat(lineLayer.getSource().getFeatures())
  if (features.length > 0) {
    source.addFeatures(features)
    var extent = source.getExtent()
    let dx = extent[2] - extent[0]
    let dy = extent[3] - extent[1]
    extent = [
      extent[0] * (1 - dx / extent[0] / 10),
      extent[1] * (1 - dy / extent[1] / 10),
      extent[2] * (1 + dx / extent[2] / 10),
      extent[3] * (1 + dy / extent[3] / 10),
    ]
    map.getView().fit(extent, map!.getSize())
  }
}
