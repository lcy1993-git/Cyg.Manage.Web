import { MapBrowserEvent } from 'ol'
import { Dispatch, SetStateAction } from 'react'
import { HistoryDispatch } from '../../../store'
import type { DragBoxProps, InterActionRef, MapRef, SourceRef } from './../typings/index'

interface Ops {
  interActionRef: InterActionRef
  mapRef: MapRef
  setState: HistoryDispatch
  setDragBoxProps: Dispatch<SetStateAction<DragBoxProps>>
  sourceRef: SourceRef
}

export default function mapClick(
  e: MapBrowserEvent<MouseEvent>,
  { mapRef, setState, setDragBoxProps, sourceRef }: Ops
) {
  // 清理高亮图层
  if (sourceRef.highLightSource.getFeatures().length) {
    sourceRef.highLightSource.clear()
  }

  setDragBoxProps({
    visible: false,
    position: [0, 0],
    selected: [],
  })

  setState((state) => {
    return {
      ...state,
      UIStatus: {
        ...state.UIStatus,
        currentMousePosition: [...e.pixel] as [number, number],
      },
    }
  })

  // 获取被选中的元素
  const highLightFeature = mapRef.map.getFeaturesAtPixel(e.pixel, {
    layerFilter(f) {
      return f.get('name') === 'highLightPointLayer' || f.get('name') === 'highLightLineLayer'
    },
  })[0]
  if (!highLightFeature) {
    setState((state) => {
      return {
        ...state,
        selectedData: [],
      }
    })
  }
}
