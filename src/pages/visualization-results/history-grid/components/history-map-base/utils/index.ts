import { Feature } from 'ol'
import Geometry from 'ol/geom/Geometry'
import { getStyle } from '../styles'
import { InterActionRef } from '../typings'

// 清空选择器和高亮图层
export const clear = (interActionRef: InterActionRef) => {
  interActionRef.select!.pointSelect.getFeatures().clear()
  interActionRef.select!.toggleSelect.getFeatures().clear()
  interActionRef.hightLightSource!.clear()
}

/**
 * 清空地图上现有的所有选择器以及所有图层的Feature元素
 * @param {InterActionRef} interActionRef
 */
export const clearScreen = (interActionRef: InterActionRef) => {
  clear(interActionRef)
  interActionRef.source!.clear()
}

// 获取元素类型
export function getGeometryType(f: Feature<Geometry>) {
  return f.getGeometry()!.getType()
}

// 添加高亮样式
export function addHightStyle(fs: Feature<Geometry>[], showText) {
  return fs.map((f) => {
    const geometryType = getGeometryType(f)
    f.setStyle(getStyle(geometryType)(f.get('type'), f.get('name'), showText, true))
    return f
  })
}

// 讲feature转为Data数组
export function getDataByFeature(f: Feature<Geometry>[]) {
  return f.map((f) => {
    const { geometry, ...props } = f.getProperties()
    return props
  })
}
