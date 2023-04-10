import { Draw } from 'ol/interaction'
import { InterActionRef, LayerRef, SourceRef } from '../typings'

interface InitDrawProps {
  interActionRef: InterActionRef
  layerRef: LayerRef
  sourceRef: SourceRef
}

export default function initDraw({ interActionRef, sourceRef }: InitDrawProps) {
  const point = new Draw({
    source: sourceRef.drawSource,
    type: 'Point',
  })

  const lineString = new Draw({
    source: sourceRef.drawSource,
    type: 'LineString',
  })

  interActionRef.draw = {
    Point: point,
    LineString: lineString,
    current: null,
  }
}
