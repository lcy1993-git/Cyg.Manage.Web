import { Collection } from 'ol'
import { Snap } from 'ol/interaction'
import Map from 'ol/Map'
import { InterActionRef, SourceRef } from './../typings/index'
interface DrawMapProps {
  geometryType: '' | 'Point' | 'LineString'
  map: Map
  interActionRef: InterActionRef
  sourceRef: SourceRef
}

// 绘制设备线路逻辑在这里写

export const onDrawGeometryChange = ({
  geometryType,
  map,
  interActionRef,
  sourceRef,
}: DrawMapProps) => {
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
    const snap = new Snap({
      features: new Collection([
        ...sourceRef.historyLineSource.getFeatures(),
        ...sourceRef.historyPointSource.getFeatures(),
        ...sourceRef.designLineSource.getFeatures(),
        ...sourceRef.designPointSource.getFeatures(),
      ]),
    })
    map.addInteraction(snap)
  }
}
