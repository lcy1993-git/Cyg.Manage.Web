import { Map } from 'ol'
import { defaults, DragPan } from 'ol/interaction'
import { mouseOnWheel } from '../event'
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
    interactions: defaults({
      doubleClickZoom: false,
      shiftDragZoom: false,
      pinchZoom: false,
      dragPan: false,
    }).extend([
      new DragPan({
        condition: mouseOnWheel,
      }),
    ]),
  })
}
