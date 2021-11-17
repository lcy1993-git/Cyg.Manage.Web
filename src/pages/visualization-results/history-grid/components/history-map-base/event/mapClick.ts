import { MapBrowserEvent } from 'ol'
import type { InterActionRef, MapRef } from './../index'

interface Ops {
  interActionRef: InterActionRef
  mapRef: MapRef
}

/**
 *
 * @param e
 * @param param1
 */

export default function mapClick(e: MapBrowserEvent<MouseEvent>, { interActionRef, mapRef }: Ops) {
  // 当处于框选状态时，清理所有框选元素
  if (interActionRef.isDragBox === true) {
    interActionRef.select!.boxSelect.getFeatures().clear()
    return
  }
  // 多选状态下ctrl键按下 不进行操作
  if (e.originalEvent.ctrlKey) return

  const feature = mapRef.map.getFeaturesAtPixel(e.pixel)[0]
  if (feature) {
    window.f = feature
    const data = feature

    /**
     * @property {LineString | Point} type
     * @property {Object} data 获取接口的数据源格式
     * @property {Feature} feature 点线实例
     * @property {[number, number]} position 点线实例
     */

    const featureData = {
      type: feature.getGeometry()!.getType(),
      data: {},
      feature,
      position: [...e.pixel],
    }

    console.log(featureData)
  }
}
