import * as extent from 'ol/extent'
import Geometry from 'ol/geom/Geometry'
import LineString from 'ol/geom/LineString'
import Point from 'ol/geom/Point'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import * as proj from 'ol/proj'
import { Vector as VectorSource, WMTS as sourceWmts, XYZ } from 'ol/source'
import tilegridWmts from 'ol/tilegrid/WMTS'
import { getLayerStyleByShowText, getStyle, polygonDragBox } from '../styles'
import { LayerRef, SourceRef } from './../typings/index'

// 卫星图层
function getVecLayer() {
  return new TileLayer({
    source: new XYZ({
      url: decodeURI(
        window.localStorage.getItem('vecUrl') ||
          'https://mt{0-3}.s02.sirenmap.com/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Galileo'
      ),
    }),
    preload: 18,
  })
}

function getStreetLayer() {
  const matrixIds = [],
    resolutions = []
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
  const street = new TileLayer({
    source: new sourceWmts({
      url: window.localStorage.getItem('streetUrl')!,
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
  street.setVisible(false)
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
  layerRef.historyLineLayer.set('name', 'historyLineLayer')
  layerRef.historyLineLayer.setZIndex(1)
  // 预设计 线路
  layerRef.designLineLayer = getLineVectorLayer(sourceRef.designLineSource)
  layerRef.designLineLayer.set('name', 'designLineLayer')
  layerRef.designLineLayer.setZIndex(2)

  // 历史网架 设备
  layerRef.historyPointLayer = getPointVectorLayer(sourceRef.historyPointSource)
  layerRef.historyPointLayer.set('name', 'historyPointLayer')
  layerRef.historyPointLayer.setZIndex(3)
  // 预设计 设备
  layerRef.designPointLayer = getPointVectorLayer(sourceRef.designPointSource)
  layerRef.designPointLayer.set('name', 'designPointLayer')
  layerRef.designPointLayer.setZIndex(4)

  // dragBOX线框
  layerRef.dragBoxLayer = new VectorLayer({
    source: sourceRef.dragBoxSource,
    style: polygonDragBox,
  })
  layerRef.dragBoxLayer.setZIndex(4)

  // 绘制图层
  layerRef.drawLayer = new VectorLayer({
    source: sourceRef.drawSource,
    // style:
  })

  const highLightLayer = new VectorLayer<VectorSource<Geometry>>({
    source: sourceRef.highLightSource,
    style(f) {
      return getStyle(f.getGeometry()!.getType())(
        f.get('sourceType'),
        f.get('typeStr') || '无类型',
        f.get('name'),
        true,
        true
      )
    },
  })
  highLightLayer.setZIndex(0)
  layerRef.highLightLayer = highLightLayer
  layerRef.highLightLayer.setZIndex(5)
}
