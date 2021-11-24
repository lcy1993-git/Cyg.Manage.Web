import MapBrowserEvent from 'ol/MapBrowserEvent'
import { handlerGeographicInformation } from '../effects/handlerGeographicInformation'

interface Ops {
  mode: string
}

export default function pointermove(evt: MapBrowserEvent<MouseEvent>, {mode}: Ops) {
  // 当前经纬度
  const coordinate = evt.coordinate
  handlerGeographicInformation(mode, coordinate)

  const positionDom = document.getElementById('historyGridPosition')
  if (positionDom) {
    positionDom.innerHTML = `经度：${coordinate[0].toFixed(4)} 维度${coordinate[1].toFixed(4)}`
  }

  // let lont = transform(coordinate, 'EPSG:3857', 'EPSG:4326');
}
