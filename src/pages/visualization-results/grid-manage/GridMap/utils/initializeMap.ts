import { MapRef } from '@/pages/visualization-results/history-grid/components/history-map-base/typings'
import TileLayer from 'ol/layer/Tile'
import Map from 'ol/Map'
import { getPointResolution, transform } from 'ol/proj'
import ProjUnits from 'ol/proj/Units'
import XYZ from 'ol/source/XYZ'
import View from 'ol/View'
import { loadAllLineLayer, loadAllPointLayer } from './loadLayer'
import mapMoveend from './mapMoveend'

interface InitOps {
  mapRef: MapRef
  ref: React.ReactNode
}
export const initMap = ({ mapRef, ref }: InitOps) => {
  mapRef.map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new XYZ({
          url:
            'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg90?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA', //瓦片的地址，如果是自己搭建的地图服务
        }),
      }),
    ],
    view: new View({
      center: transform([118.5144, 31.6807], 'EPSG:4326', 'EPSG:3857'),
      zoom: 10,
    }),
  })

  mapRef.map.on('moveend', (e: Event) => {
    mapMoveend(e, mapRef.map)
  })
}

export const loadMapLayers = (ids: string[], map: any) => {
  loadAllPointLayer(ids, map)
  loadAllLineLayer(ids, map)
}

// 获取比例尺
export const getScale = (map: any) => {
  const view = map.getView()
  let pointResolution = getPointResolution(
    view.getProjection(),
    view.getResolution(),
    view.getCenter(),
    ProjUnits.METERS
  )

  let minWidth = 64
  let nominalCount = minWidth * pointResolution
  let suffix = ''
  if (nominalCount < 0.001) {
    suffix = 'μm'
    pointResolution *= 1000000
  } else if (nominalCount < 1) {
    suffix = 'mm'
    pointResolution *= 1000
  } else if (nominalCount < 1000) {
    suffix = 'm'
  } else {
    suffix = 'km'
    pointResolution /= 1000
  }

  let i = 3 * Math.floor(Math.log(minWidth * pointResolution) / Math.log(10))
  let count, width, decimalCount
  const LEADING_DIGITS = [1, 2, 5]

  while (true) {
    decimalCount = Math.floor(i / 3)
    const decimal = Math.pow(10, decimalCount)
    count = LEADING_DIGITS[((i % 3) + 3) % 3] * decimal
    width = Math.round(count / pointResolution)
    if (isNaN(width)) {
      // this.element.style.display = 'none';
      // this.renderedVisible_ = false;
      return
    } else if (width >= minWidth) {
      break
    }
    ++i
  }
  let text = count.toFixed(decimalCount < 0 ? -decimalCount : 0) + ' ' + suffix
  return '1 : ' + text
}
