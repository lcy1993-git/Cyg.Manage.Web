import { message } from 'antd'
import JsonP from 'jsonp'
import { Feature } from 'ol'
import Geometry from 'ol/geom/Geometry'
import * as proj from 'ol/proj'
import { getStyle } from '../styles'
import { InterActionRef, ViewRef } from '../typings'

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

// 定位当前用户位置；调用的是百度定位api
export const checkUserLocation = (viewRef: ViewRef) => {
  JsonP(
    `https://map.baidu.com?qt=ipLocation&t=${new Date().getTime()}`,
    {},
    function (err: any, res: any) {
      if (err) {
        message.error(err)
      } else {
        if (res?.rgc?.status === 'success') {
          const lat = parseFloat(res?.rgc?.result?.location?.lat)
          const lng = parseFloat(res?.rgc?.result?.location?.lng)
          if (!isNaN(lat) && !isNaN(lng)) {
            viewRef.view.setCenter(proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'))
          } else {
            message.error('获取的位置信息无效，无法定位')
          }
        }
      }
    }
  )
}
