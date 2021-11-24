import { MapBrowserEvent } from 'ol'
import { HistoryDispatch } from '../../../store'
import type { InterActionRef, MapRef } from './../typings/index'

interface Ops {
  interActionRef: InterActionRef
  mapRef: MapRef
  setState: HistoryDispatch
}

export default function mapClick(
  e: MapBrowserEvent<MouseEvent>,
  { interActionRef, mapRef, setState }: Ops
) {
  // 设置当前坐标
  // setState("currentMousePosition", [...e.pixel] as [number, number])
  setState((state) => {
    return {
      ...state,
      UIStatus: {
        ...state.UIStatus,
        currentMousePosition: [...e.pixel] as [number, number],
      },
    }
  })
  // setState({
  //   type: 'changeUIStatus',
  //   payload: {
  //     ...UIStatus,
  //     currentMousePosition: [...e.pixel] as [number, number],
  //   },
  // })

  // 当处于框选状态时，清理所有框选元素
  if (interActionRef.isDragBox === true) {
    interActionRef.select!.boxSelect.getFeatures().clear()
    return
  }
  // 多选状态下ctrl键按下 不进行操作
  if (e.originalEvent.ctrlKey) return

  // 获取被选中的元素
  // const feature = mapRef.map.getFeaturesAtPixel(e.pixel)[0]
}
