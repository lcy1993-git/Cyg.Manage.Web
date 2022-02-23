import { DrawEvent } from 'ol/interaction/Draw'
import { DrawProps, SourceRef } from '../typings'

interface DrawEndByLineStringProps {
  sourceRef: SourceRef
  drawProps: DrawProps
  type: 'Point' | 'LineString'
  e: DrawEvent
}

export function drawEnd({ drawProps, type, e }: DrawEndByLineStringProps) {
  // @ts-ignore
  drawProps.currentState = e.target.sketchCoords_
  drawProps.type = type
  drawProps.visible = true
  // @ts-ignore
  drawProps.position = [...e.target.downPx_] as [number, number]
}
