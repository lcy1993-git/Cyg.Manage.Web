import { MapRef } from '@/pages/visualization-results/history-grid/components/history-map-base/typings'
import { message } from 'antd'
import GeoJSON from 'ol/format/GeoJSON'
import WKT from 'ol/format/WKT'
import { Draw } from 'ol/interaction'
import { createBox } from 'ol/interaction/Draw'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import Map from 'ol/Map'
import { getPointResolution, transform } from 'ol/proj'
import ProjUnits from 'ol/proj/Units'
import { Vector as VectorSource, XYZ } from 'ol/source'
import { Fill, Stroke, Style, Text } from 'ol/style'
import View from 'ol/View'
import { pointType } from '..'
import DrawTool from './draw'
import { getLayer, loadAllLayer, loadAllPointLayer } from './loadLayer'
import mapMoveend from './mapMoveend'
import { moveOverlay } from './overlay'
import {
  deleFeature,
  getCurrrentSelectFeature,
  getSelectFeatures,
  initSelect,
  setDeleFeatures,
  setSelectActive,
} from './select'
import { calculateDistance, lineStyle, pointStyle, twinkle } from './style'
import { companyId, getDistrictdata } from './utils'
// interface pointType {
//   featureType: string
//   name?: string
//   kvLevel?: string
//   designScaleMainTransformer?: string
//   builtScaleMainTransformer?: string
//   mainWiringMode?: string
//   powerType?: string
//   installedCapacity?: string
//   schedulingMode?: string
//   lineId?: string
//   capacity?: string
//   model?: string
//   properties?: string
//   lng?: string
//   geom: string
//   id: string
// }
interface InitOps {
  mapRef: MapRef
  ref: React.ReactNode
  isActiveFeature: (data: pointType | null) => void
  isDragPointend: (isDrag: boolean) => void
}
var drawTool: any
var pointLayer: any
var lineLayer: any
var boxSelectFeatures: any = []
var dragBox: any

export const initMap = ({ mapRef, ref, isActiveFeature, isDragPointend }: InitOps) => {
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
      center: transform([104.08537388, 30.58850819], 'EPSG:4326', 'EPSG:3857'),
      zoom: 5,
    }),
  })
  // @ts-ignore
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
        // 框选元素判断
        const boxfeature = boxSelectFeatures.find((item: any) => item === feature)

        // 单个元素判断
        if ((currrentSelectFeature && currrentSelectFeature === feature) || boxfeature) {
          feature.setStyle(pointStyle(feature.get('data'), true, level, isDraw))
        } else {
          feature.setStyle(pointStyle(feature.get('data'), false, level, isDraw))
        }
      })
  })

  mapRef.map.on('pointermove', (e: any) => {
    moveOverlay(mapRef.map, e.coordinate)
  })

  initSelect(mapRef.map, isActiveFeature, isDragPointend)

  drawBox(mapRef.map)
  loadGeoJson(mapRef.map)
}

// 加载行政区域边界
const loadGeoJson = (map: any) => {
  getDistrictdata().then((result: any) => {
    let features: any[] = []
    result.forEach((item: any) => {
      features.push(...item.features)
    })
    const data = {
      type: 'FeatureCollection',
      features,
    }
    const vectorSource = new VectorSource({
      features: new GeoJSON({
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }).readFeatures(data),
    })
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: (feature: any) => {
        return new Style({
          stroke: new Stroke({
            color: 'rgba(54,131,160,1)',
            width: 2,
          }),
          text: new Text({
            font: '16px Source Han Sans SC',
            text: feature.getProperties().name,
            fill: new Fill({
              //文字填充色
              color: 'white',
            }),
            stroke: new Stroke({
              //文字边界宽度与颜色
              color: 'rgba(21, 32, 32, 1)',
              width: 2,
            }),
          }),
        })
      },
    })
    map.addLayer(vectorLayer)
  })
}
// 根据geom字段定位（去重功能）
export const locationByGeom = (map: any, geom: String) => {
  const point: any = new WKT().readGeometry(geom)
  const lont = point.getCoordinates()
  location(map, lont[0], lont[1], 20)
}

// 根据经纬度定位
export const location = (map: any, lon: number, lat: number, zoom: number = 12) => {
  map.getView().setCenter(transform([lon, lat], 'EPSG:4326', 'EPSG:3857'))
  map.getView().setZoom(zoom)
}

// 绘制点位
export const drawPoint = (map: any, options: any, clickEvent: any) => {
  pointLayer = getLayer(map, 'pointLayer', 3)
  // options.type_ = 'Point'
  // if (!drawTool) drawTool = new DrawTool(map, options)
  // drawTool.setSource(pointLayer.getSource())
  // drawTool.drawGeometry(options, clickEvent)
  loadAllPointLayer(map, ['Tower', 'TransformerSubstation'])
  twinkle(pointLayer, options.featureType)
}

// 绘制线路
export const drawLine = (map: any, options: any) => {
  lineLayer = getLayer(map, 'lineLayer', 2)
  options.type_ = 'LineString'
  if (!drawTool) drawTool = new DrawTool(map, options)
  drawTool.setSource(lineLayer.getSource())
  drawTool.drawGeometry(options)
}

// 拉框删除
export const drawBox = (map: any) => {
  dragBox = new Draw({
    source: new VectorSource(),
    // condition: platformModifierKeyOnly,
    type: 'Circle',
    geometryFunction: createBox(),
  })
  map.addInteraction(dragBox)

  dragBox.on('drawstart', function () {
    boxSelectFeatures = []
    getSelectFeatures().clear()
  })

  dragBox.on('drawend', function (e: any) {
    const extent = e.feature.getGeometry().getExtent()
    pointLayer = getLayer(map, 'pointLayer')
    boxSelectFeatures = pointLayer
      .getSource()
      .getFeaturesInExtent(extent)
      .filter((feature: any) => feature.getGeometry().intersectsExtent(extent))
    getSelectFeatures().extend(boxSelectFeatures)
    // dragBox.setActive(false)
  })
  dragBox.setActive(false)
}

export const setDrawBox = (active: boolean) => {
  dragBox.setActive(active)
}

// 删除拉框范围中的要素
export const deletBoxFeature = (map: any) => {
  if (boxSelectFeatures.length === 0) return
  setDeleFeatures([])

  const isCorrect = boxSelectFeatures.find((item: any) => item.get('data').companyId !== companyId)
  if (isCorrect) {
    message.error('无法删除，删除元素包含子公司项目')
    return
  }

  boxSelectFeatures.forEach((feature: any) => {
    deleFeature(map, feature)
  })
  boxSelectFeatures = []
}

// 获取所有绘制的点位要素
export const getDrawPoints = () => {
  if (drawTool) return drawTool.getAllDrawPoints()
  else return null
}

// 获取所有绘制的线路要素
export const getDrawLines = () => {
  if (drawTool) return drawTool.getAllDrawLines()
  else return null
}

// 获取所有展示的点位要素
export const getShowPoints = (map: any) => {
  pointLayer = getLayer(map, 'pointLayer')
  return pointLayer.getSource().getFeatures()
}

// 获取所有展示的点位要素
export const getShowLines = (map: any) => {
  lineLayer = getLayer(map, 'lineLayer')
  return lineLayer.getSource().getFeatures()
}

// 加载地图图层
export const loadMapLayers = (data: any, map: any) => {
  loadAllLayer(data, map)
}

// 获取线路的总长度
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

// 根据线路更线段属性和样式
export const upateLineByMainLine = (map: any, data: any) => {
  lineLayer = getLayer(map, 'lineLayer')
  pointLayer = getLayer(map, 'pointLayer')
  for (let i = 0; i < pointLayer.getSource().getFeatures().length; i++) {
    if (pointLayer.getSource().getFeatures()[i].get('data').lineId === data.id) {
      const level = parseFloat(map.getView().getZoom() + '')
      pointLayer.getSource().getFeatures()[i].get('data').color = data.color
      pointLayer.getSource().getFeatures()[i].get('data').kvLevel = data.kvLevel
      pointLayer.getSource().getFeatures()[i].get('data').lineModel = data.lineModel
      pointLayer.getSource().getFeatures()[i].get('data').lineType = data.lineType
      pointLayer.getSource().getFeatures()[i].get('data').isOverhead = data.isOverhead
      pointLayer
        .getSource()
        .getFeatures()
        [i].setStyle(
          pointStyle(pointLayer.getSource().getFeatures()[i].get('data'), false, level, false)
        )
    }
  }

  for (let i = 0; i < lineLayer.getSource().getFeatures().length; i++) {
    if (lineLayer.getSource().getFeatures()[i].get('data').lineId === data.id) {
      lineLayer.getSource().getFeatures()[i].get('data').color = data.color
      lineLayer.getSource().getFeatures()[i].get('data').kvLevel = data.kvLevel
      lineLayer.getSource().getFeatures()[i].get('data').lineModel = data.lineModel
      lineLayer.getSource().getFeatures()[i].get('data').lineType = data.lineType
      lineLayer.getSource().getFeatures()[i].get('data').isOverhead = data.isOverhead
      lineLayer
        .getSource()
        .getFeatures()
        [i].setStyle(lineStyle(lineLayer.getSource().getFeatures()[i].get('data')))
    }
  }
}

// 清除绘制
export const clear = () => {
  drawTool && drawTool.snap && drawTool.snap.setActive(false)
  drawTool && drawTool.draw && drawTool.draw.setActive(false)
  setSelectActive(true)
}

// 表单更新退出绘制并保存
export const exitDraw = () => {
  drawTool && drawTool.snap && drawTool.snap.setActive(false)
  drawTool && drawTool.draw && drawTool.draw.setActive(false)
}

// 清除拉框数据
export const clearBoxData = () => {
  boxSelectFeatures = []
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
