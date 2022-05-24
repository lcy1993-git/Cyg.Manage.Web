import WKT from 'ol/format/WKT'
import { pointStyle } from './style'

/**
 * 加载点位数据
 * @param ids 选择的所有id
 * @param type 点位类型
 * @param layer
 */
export const loadPoint = (ids: string[], type: string, layer: any) => {
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
    feature.setStyle(pointStyle(type, false))
    // 加载数据到图层
    layer.getSource().addFeature(feature)
  })
}
