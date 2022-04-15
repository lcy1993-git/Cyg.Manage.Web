import { Map } from 'ol'
import { LayerRef, MapRef, ViewRef } from './../typings'
interface InitMapOps {
  layerRef: LayerRef
  mapRef: MapRef
  viewRef: ViewRef
  ref: HTMLDivElement
}

export function initMap({ layerRef, mapRef, viewRef, ref }: InitMapOps) {
  mapRef.map = new Map({
    target: ref,
    layers: Object.values(layerRef),
    view: viewRef.view,
    // controls: defaults({attribution: false})
  })
}
