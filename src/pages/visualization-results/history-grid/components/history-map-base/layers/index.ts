import * as extent from 'ol/extent'
import Geometry from 'ol/geom/Geometry'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import * as proj from 'ol/proj'
import { Vector as VectorSource, WMTS as sourceWmts, XYZ } from 'ol/source'
import tilegridWmts from 'ol/tilegrid/WMTS'
import { getStyle } from '../styles'

// 卫星图层
export const vecLayer = new TileLayer({
  source: new XYZ({
    url: decodeURI(
      'https://mt{0-3}.s02.sirenmap.com/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Galileo'
    ),
  }),
  preload: 18,
})
vecLayer.set('name', 'SATELLITE')

const matrixIds = [],
  resolutions = []
//瓦片大小
//坐标系信息
const projection = proj.get('EPSG:4326')

var projectionExtent = projection.getExtent()
var size = extent.getWidth(projectionExtent) / 256
// 初始化分辨率组
for (let i = 0; i < 18; i++) {
  resolutions[i] = size / Math.pow(2, i)
  matrixIds[i] = i.toString()
}
// 街道图层
export const streetLayer = new TileLayer({
  source: new sourceWmts({
    url: 'http://t{0-7}.tianditu.gov.cn/vec_c/wmts?tk=88b666f44bb8642ec5282ad2a9915ec5',
    layer: 'vec',
    matrixSet: 'c',
    format: 'tiles',
    style: 'default',
    projection: proj.get('EPSG:4326'),
    tileGrid: new tilegridWmts({
      origin: extent.getTopLeft(projectionExtent),
      resolutions: resolutions,
      matrixIds: matrixIds,
    }),
    wrapX: false,
  }),
})
streetLayer.setVisible(false)
streetLayer.set('name', 'STREET')

// ann图
const annUrl =
  'https://t{0-7}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=88b666f44bb8642ec5282ad2a9915ec5'
export const annLayer = new TileLayer({
  source: new XYZ({
    url: decodeURI(annUrl),
  }),
  preload: 18,
})
annLayer.set('name', 'annLayer')

// 数据图层Vector层
export const getVectorLayer = (source: VectorSource<Geometry>) => {
  return new VectorLayer({
    source: source,
  })
}
