import WKT from 'ol/format/WKT'
import { Vector } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import Configs from './config'
import { lineStyle, pointStyle } from './style'

// 加载所有点图层
export const loadAllPointLayer = (ids: string[], map: any) => {
  let pointLayer = map
    .getLayers()
    .getArray()
    .find((item: any) => item.get('name') === 'pointLayer')
  if (pointLayer) {
    pointLayer.getSource().clear()
  } else {
    pointLayer = new Vector({
      source: new VectorSource(),
      zIndex: 3,
    })
    map.addLayer(pointLayer)
  }
  Configs.point.forEach((item: any) => {
    loadPointLayer(ids, item, 'point', pointLayer)
  })
}

// 加载所有线图层
export const loadAllLineLayer = (ids: string[], map: any) => {
  let lineLayer = map
    .getLayers()
    .getArray()
    .find((item: any) => item.get('name') === 'lineLayer')
  if (lineLayer) {
    lineLayer.getSource().clear()
  } else {
    lineLayer = new Vector({
      source: new VectorSource(),
      zIndex: 2,
    })
    map.addLayer(lineLayer)
  }
  Configs.line.forEach((item: any) => {
    loadPointLayer(ids, item, 'line', lineLayer)
  })
}

/**
 * 加载数据
 * @param ids 选择的所有id
 * @param type 点位类型
 * @param layer
 */
export const loadPointLayer = (ids: string[], type: string, geomType: string, layer: any) => {
  // 根据ids获取杆塔数据
  const data: any = []
  data.forEach((item: any) => {
    // 根据wkt数据格式加载feature
    let format = new WKT()
    let feature = format.readFeature(item.geom, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    })
    // 设置数据类型
    item.dataType = type
    feature.set('data', item)
    // 设置样式
    if (geomType === 'point') feature.setStyle(pointStyle(feature.get('data'), false))
    else feature.setStyle(lineStyle(feature.get('data'), false))
    // 加载数据到图层
    layer.getSource().addFeature(feature)
  })
}
