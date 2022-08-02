import { Map } from 'ol'
import React from 'react'

export interface MapRef {
  mapRef: globalThis.Map<unknown, unknown>
  map: Map
}
export const useCurrentRef = <T>(value: any): T => {
  const ref = React.useRef<T>(value)
  return ref.current
}
