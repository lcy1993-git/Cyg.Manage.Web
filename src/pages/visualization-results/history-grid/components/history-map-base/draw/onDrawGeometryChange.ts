import Map from 'ol/Map'
import { InterActionRef } from './../typings/index'
interface DrawMapProps {
  geometryType: '' | 'Point' | 'LineString'
  map: Map
  interActionRef: InterActionRef
}

// 绘制设备线路逻辑在这里写

export const onDrawGeometryChange = ({ geometryType, map, interActionRef }: DrawMapProps) => {
  // 处理绘制模式下的多选功能
  interActionRef.select.currentSelect?.setActive(!geometryType)
  // 处理绘制模式下的框选功能
  interActionRef.dragBox?.setActive(!geometryType)

  // 根据geometryType开启或者关闭draw
  if (interActionRef.draw?.current) {
    map.removeInteraction(interActionRef.draw.current)
    interActionRef.draw!.current = null
  }
  if (geometryType) {
    interActionRef.draw!.current = interActionRef.draw![geometryType]
    map.addInteraction(interActionRef.draw![geometryType])
  }
}
