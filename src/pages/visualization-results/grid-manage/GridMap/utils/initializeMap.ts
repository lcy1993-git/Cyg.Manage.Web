import { MapRef } from '@/pages/visualization-results/history-grid/components/history-map-base/typings'
import WKT from 'ol/format/WKT'
import { Tile as TileLayer } from 'ol/layer'
import Map from 'ol/Map'
import { getPointResolution, transform } from 'ol/proj'
import ProjUnits from 'ol/proj/Units'
import { XYZ } from 'ol/source'
import View from 'ol/View'
import DrawTool from './draw'
import { getLayer, loadAllLayer } from './loadLayer'
import mapMoveend from './mapMoveend'
import { moveOverlay } from './overlay'
import { getCurrrentSelectFeature, initSelect, setSelectActive } from './select'
import { calculateDistance, pointStyle } from './style'
interface pointType {
  featureType: string
  name?: string
  kvLevel?: string
  designScaleMainTransformer?: string
  builtScaleMainTransformer?: string
  mainWiringMode?: string
  powerType?: string
  installedCapacity?: string
  schedulingMode?: string
  lineId?: string
  capacity?: string
  model?: string
  properties?: string
  lng?: string
  geom: string
  id: string
}
interface InitOps {
  mapRef: MapRef
  ref: React.ReactNode
  isActiveFeature: (data: pointType | null) => void
}
var drawTool: any
var pointLayer: any
var lineLayer: any

export const initMap = ({ mapRef, ref, isActiveFeature }: InitOps) => {
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
      center: transform([104.08537388, 30.58850819], 'EPSG:4326', 'EPSG:3857'),
      zoom: 5,
    }),
  })

  mapRef.map.on('moveend', (e: Event) => {
    mapMoveend(e, mapRef.map)
    pointLayer = getLayer(mapRef.map, 'pointLayer')
    const level = parseFloat(mapRef.map.getView().getZoom() + '')
    const currrentSelectFeature = getCurrrentSelectFeature()
    pointLayer
      .getSource()
      .getFeatures()
      .forEach((feature: any) => {
        let isDraw = false
        if (feature.get('data').type_) isDraw = true
        if (currrentSelectFeature && currrentSelectFeature === feature) {
          feature.setStyle(pointStyle(feature.get('data'), true, level, isDraw))
        } else {
          feature.setStyle(pointStyle(feature.get('data'), false, level, isDraw))
        }
      })
  })

  mapRef.map.on('pointermove', (e: any) => {
    moveOverlay(mapRef.map, e.coordinate)
  })

  initSelect(mapRef.map, isActiveFeature)
  // drawPoint(mapRef.map, {})
  // drawLine(mapRef.map, { featureType: 'Line' })
}
export const location = (map: any, lon: number, lat: number) => {
  map.getView().setCenter(transform([lon, lat], 'EPSG:4326', 'EPSG:3857'))
}
export const drawPoint = (map: any, options: any) => {
  pointLayer = getLayer(map, 'pointLayer', 3)
  options.type_ = 'Point'
  if (!drawTool) drawTool = new DrawTool(map, options)
  drawTool.setSource(pointLayer.getSource())
  drawTool.drawGeometry(options)
}

export const drawLine = (map: any, options: any) => {
  lineLayer = getLayer(map, 'lineLayer', 2)
  options.type_ = 'LineString'
  if (!drawTool) drawTool = new DrawTool(map, options)
  drawTool.setSource(lineLayer.getSource())
  drawTool.drawGeometry(options)
}

export const getDrawPoints = () => {
  if (drawTool) return drawTool.getAllDrawPoints()
  else return null
}

export const getDrawLines = () => {
  if (drawTool) return drawTool.getAllDrawLines()
  else return null
}

export const loadMapLayers = (data: any, map: any) => {
  loadAllLayer(data, map)
}

export const getTotalLength = (data: any) => {
  let totalLength = 0
  data.forEach((item: any) => {
    var format = new WKT()
    const geomtery: any = format.readGeometry(item.geom)
    const length = calculateDistance(geomtery.getCoordinates()[0], geomtery.getCoordinates()[1])
    totalLength += length
  })
  return totalLength
}

export const clear = () => {
  drawTool && drawTool.snap && drawTool.snap.setActive(false)
  drawTool && drawTool.draw && drawTool.draw.setActive(false)
  setSelectActive(true)
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
