import { Dispatch, SetStateAction } from 'react'
import { HistoryDispatch } from '../../../store'
import { handlerGeographicSize } from '../effects'
// import { select } from 'ol/interaction/Select'
import { DragBoxProps, InterActionRef, LayerRef, MapRef, SourceRef, ViewRef } from './../typings'
import { initControl } from './initControl'
import { initLayer } from './initLayer'
import { initMap } from './initMap'
import initSelect from './initSelect'
import { initSource } from './initSource'
import { initView } from './initView'

interface InitOps {
  sourceRef: SourceRef
  layerRef: LayerRef
  viewRef: ViewRef
  mapRef: MapRef
  ref: HTMLDivElement
  interActionRef: InterActionRef
  setState: HistoryDispatch
  mode: string
  setDragBoxProps: Dispatch<SetStateAction<DragBoxProps>>
}

function init({
  setState,
  interActionRef,
  sourceRef,
  layerRef,
  viewRef,
  mapRef,
  ref,
  mode,
  setDragBoxProps,
}: InitOps) {
  initSource(sourceRef)
  initLayer(layerRef, sourceRef)
  initView(viewRef)
  initMap({ viewRef, mapRef, layerRef, ref })

  initControl({ mapRef, mode })
  initSelect({
    interActionRef,
    mapRef,
    sourceRef,
    setState,
    setDragBoxProps,
  })

  // 显示比例尺
  handlerGeographicSize({ mode, viewRef })
}

export default init
