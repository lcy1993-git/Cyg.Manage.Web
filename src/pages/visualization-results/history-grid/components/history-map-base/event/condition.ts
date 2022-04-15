import { MapBrowserEvent } from 'ol'

export function mouseOnWheel(e: MapBrowserEvent<any>) {
  return e.originalEvent.pointerType === 'mouse' && e.originalEvent.button === 1
}
