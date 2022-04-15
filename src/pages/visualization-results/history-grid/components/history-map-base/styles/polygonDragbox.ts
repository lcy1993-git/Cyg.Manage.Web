import { Fill, Stroke, Style } from 'ol/style'
import { SourceType } from '../typings'

export const polygonDragBox = new Style({
  stroke: new Stroke({
    color: SourceType.highLight,
    width: 1,
  }),
  fill: new Fill({
    color: 'rgba(249, 149, 52, 0.1)',
  }),
})
