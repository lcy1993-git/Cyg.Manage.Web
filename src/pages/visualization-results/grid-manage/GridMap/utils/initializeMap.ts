import { MapRef } from '@/pages/visualization-results/history-grid/components/history-map-base/typings'
import TileLayer from 'ol/layer/Tile'
import Map from 'ol/Map'
import { transform } from 'ol/proj'
import XYZ from 'ol/source/XYZ'
import View from 'ol/View'

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
          url: 'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg90?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA', //瓦片的地址，如果是自己搭建的地图服务
        }),
      }),
    ],
    view: new View({
      center: transform([118.5144, 31.6807], 'EPSG:4326', 'EPSG:3857'),
      zoom: 10,
    }),
  })
}
