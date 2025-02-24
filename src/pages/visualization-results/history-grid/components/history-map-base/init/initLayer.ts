import LineString from 'ol/geom/LineString'
import Point from 'ol/geom/Point'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import { Vector as VectorSource, XYZ } from 'ol/source'
import { getLayerStyleByShowText } from '../styles'
import { LayerRef, SourceRef } from './../typings/index'

// 卫星图层
function getVecLayer() {
  let imgLayer = new TileLayer({
    source: new XYZ({
      url: decodeURI(
        window.localStorage.getItem('vecUrl') ||
          'https://mt{0-3}.s02.sirenmap.com/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Galileo'
      ),
    }),
    preload: 18,
  })
  imgLayer.set('name', 'imgLayer')
  return imgLayer
}

function getStreetLayer() {
  // const matrixIds = [],
  //   resolutions = []
  // //坐标系信息
  // const projection = proj.get('EPSG:4326')

  // var projectionExtent = projection.getExtent()
  // var size = extent.getWidth(projectionExtent) / 256
  // // 初始化分辨率组
  // for (let i = 0; i < 18; i++) {
  //   resolutions[i] = size / Math.pow(2, i)
  //   matrixIds[i] = i.toString()
  // }
  // // 街道图层
  // const street = new TileLayer({
  //   source: new sourceWmts({
  //     url:
  //       window.localStorage.getItem('streetUrl') ||
  //       'http://t{0-7}.tianditu.gov.cn/vec_c/wmts?tk=88b666f44bb8642ec5282ad2a9915ec5',
  //     layer: 'vec',
  //     matrixSet: 'c',
  //     format: 'tiles',
  //     style: 'default',
  //     projection: proj.get('EPSG:4326'),
  //     tileGrid: new tilegridWmts({
  //       origin: extent.getTopLeft(projectionExtent),
  //       resolutions: resolutions,
  //       matrixIds: matrixIds,
  //     }),
  //     wrapX: false,
  //   }),
  // })

  const street = new TileLayer({
    source: new XYZ({
      url:
        window.localStorage.getItem('streetUrl') ||
        'http://t{0-7}.tianditu.gov.cn/vec_c/wmts?tk=88b666f44bb8642ec5282ad2a9915ec5',
    }),
    preload: 18,
  })
  street.setVisible(false)
  street.set('name', 'vecLayer')
  return street
}

function getAnnLayer() {
  // ann图
  const annUrl =
    'https://t{0-7}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=88b666f44bb8642ec5282ad2a9915ec5'
  return new TileLayer({
    source: new XYZ({
      url: decodeURI(annUrl),
    }),
    preload: 18,
  })
}

/**
 * 点位数据源图层
 * @param source
 * @returns
 */
function getPointVectorLayer(source: VectorSource<Point>): VectorLayer<VectorSource<Point>> {
  return new VectorLayer({
    source: source,
    style: getLayerStyleByShowText(true),
    zIndex: 2,
  })
}
/**
 * 线路数据源图层
 * @param source
 * @returns
 */
export function getLineVectorLayer(
  source: VectorSource<LineString>
): VectorLayer<VectorSource<LineString>> {
  return new VectorLayer({
    source: source,
    style: getLayerStyleByShowText(true),
    zIndex: 1,
  })
}

/**
 * 初始化图层
 * @param layerRef
 * @param sourceRef
 */

export function initLayer(layerRef: LayerRef, sourceRef: SourceRef) {
  // 添加 卫星图
  layerRef.vecLayer = getVecLayer()
  // 添加街道图层
  layerRef.streetLayer = getStreetLayer()
  // 添加地域名称图层
  layerRef.annLayer = getAnnLayer()

  // 历史网架 线路
  layerRef.historyLineLayer = getLineVectorLayer(sourceRef.historyLineSource)
  // 预设计 线路
  layerRef.designLineLayer = getLineVectorLayer(sourceRef.designLineSource)
  // 历史网架 设备
  layerRef.historyPointLayer = getPointVectorLayer(sourceRef.historyPointSource)
  // 预设计 设备
  layerRef.designPointLayer = getPointVectorLayer(sourceRef.designPointSource)
}
