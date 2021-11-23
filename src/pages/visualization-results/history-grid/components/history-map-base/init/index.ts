import { SourceRef, LayerRef, ViewRef, MapRef } from './../typings'
import { initSource } from './initSource'
import { initLayer } from './initLayer'
import { initView } from './initView'
import { initMap } from './initMap'

interface InitOps {
  sourceRef: SourceRef
  layerRef: LayerRef
  viewRef: ViewRef
  mapRef: MapRef
  ref: HTMLDivElement
}

function init({ sourceRef, layerRef, viewRef, mapRef, ref }: InitOps) {
  initSource(sourceRef)
  initLayer(layerRef, sourceRef)
  initView(viewRef)
  initMap({viewRef, mapRef, layerRef, ref})
}

export default init
