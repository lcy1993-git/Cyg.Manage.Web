import { MapBrowserEvent } from 'ol';
import type { InterActionRef, MapRef, SetState } from './../typings/index';

interface Ops {
  interActionRef: InterActionRef
  mapRef: MapRef
  setState: SetState
}

/**
 *
 * @param e
 * @param param1
 */

export default function mapClick(e: MapBrowserEvent<MouseEvent>, { interActionRef, mapRef, setState }: Ops) {
  // 设置当前坐标
  setState("currentMousePosition", [...e.pixel] as [number, number])

  // 当处于框选状态时，清理所有框选元素
  if (interActionRef.isDragBox === true) {
    interActionRef.select!.boxSelect.getFeatures().clear()
    return
  }
  // 多选状态下ctrl键按下 不进行操作
  if (e.originalEvent.ctrlKey) return

  // 获取被选中的元素
  const feature = mapRef.map.getFeaturesAtPixel(e.pixel)[0]
}
