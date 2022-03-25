import Control from 'ol/control/Control'
import { default as Group, default as LayerGroup } from 'ol/layer/Group'
import Layer from 'ol/layer/Layer'
import TileLayer from 'ol/layer/Tile'
import * as proj from 'ol/proj'
import XYZ from 'ol/source/XYZ'
import View from 'ol/View'

export interface BaseMapProps {
  layers: Layer[]
  layerGroups: LayerGroup[]
  trackLayers: LayerGroup[]
  controls?: Control[]
  view: View
  setLayers: (arg0: Layer[]) => void
  setLayerGroups: (arg0: LayerGroup[]) => void
  setTrackLayerGroups: (arg0: LayerGroup[]) => void
  setView: (arg0: View) => void
}

export const initLayers = (resData: any): Layer[] => {
  // 初始化data

  if (resData && resData.code && resData.code !== 200) return []

  let vecUrl = ''
  let imgUrl = ''

  let data = resData.code ? resData.data[0] : resData[0]
  // 卫星图
  imgUrl = resData.code
    ? data.url.replace(
        '{s}',
        '{' + data.servers[0] + '-' + data.servers[data.servers.length - 1] + '}'
      )
    : data.url.replace(
        '{s}',
        '{' + data.hostId[0] + '-' + data.hostId[data.hostId.length - 1] + '}'
      )
  imgUrl =
    imgUrl ||
    'https://t%7B0-7%7D.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=88b666f44bb8642ec5282ad2a9915ec5'
  const imgLayer = new TileLayer({
    source: new XYZ({
      url: decodeURI(imgUrl),
    }),
    preload: 18,
  })
  imgLayer.set('name', 'imgLayer')

  // 街道图
  // vecUrl = data.url.replace(
  //   '{s}',
  //   '{' + data.servers[0] + '-' + data.servers[data.servers.length - 1] + '}'
  // )
  vecUrl =
    // vecUrl ||
    'https://t%7B0-7%7D.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=88b666f44bb8642ec5282ad2a9915ec5'
  // const testUrl = 'http://t{0-7}.tianditu.gov.cn/vec_c/wmts?tk=88b666f44bb8642ec5282ad2a9915ec5'
  //分辨率数组
  // var resolutions = []
  // //瓦片大小
  // // var tileSize = 256
  // //坐标系信息
  // var projection = proj.get('EPSG:4326')
  // //获取当前坐标系的范围

  // var projectionExtent = projection.getExtent()
  // var size = extent.getWidth(projectionExtent) / 256
  // var matrixIds = new Array(18)
  // //初始化分辨率数组
  // for (let i = 0; i < 18; i++) {
  //   resolutions[i] = size / Math.pow(2, i)
  //   matrixIds[i] = i
  // }
  // const vecLayer = new TileLayer({
  //   source: new sourceWmts({
  //     url: imgUrl,
  //     layer: 'vec',
  //     matrixSet: 'c',
  //     format: 'tiles',
  //     style: 'default',
  //     projection: projection,
  //     tileGrid: new tilegridWmts({
  //       origin: extent.getTopLeft(projectionExtent),
  //       resolutions: resolutions,
  //       matrixIds: matrixIds,
  //     }),
  //     wrapX: false,
  //   }),
  // })

  const vecLayer = new TileLayer({
    source: new XYZ({
      url: decodeURI(vecUrl),
    }),
    preload: 18,
  })
  vecLayer.setVisible(false)
  vecLayer.set('name', 'vecLayer')

  // ann图
  // const annUrl =
  //   'https://t{0-7}.tianditu.gov.cn/DataServer?T=cva_c&x={x}&y={y}&l={z}&tk=88b666f44bb8642ec5282ad2a9915ec5'
  // const annLayer = new TileLayer({
  //   source: new XYZ({
  //     url: decodeURI(annUrl),
  //   }),
  //   preload: 18,
  // })
  // annLayer.set('name', 'annLayer')

  return [imgLayer, vecLayer]
}

export const initOtherLayers = (): LayerGroup[] => {
  // 预设图层
  const preDesignLayer = new Group()
  preDesignLayer.setVisible(false)
  preDesignLayer.set('name', 'preDesignLayer')

  // 勘察图
  const surveyLayer = new Group()
  surveyLayer.setOpacity(0.5)
  surveyLayer.setVisible(false)
  surveyLayer.set('name', 'surveyLayer')

  // 方案图
  const planLayer = new Group()
  planLayer.setVisible(false)
  planLayer.set('name', 'planLayer')

  // 设计图
  const designLayer = new Group()
  designLayer.set('name', 'designLayer')

  // 拆除图
  const dismantleLayer = new Group()
  dismantleLayer.setVisible(false)
  dismantleLayer.set('name', 'dismantleLayer')

  // 跟踪图
  // const surveyTrackLayer = new Group();

  // 高亮图层
  // const dismantleLayers = new

  return [preDesignLayer, surveyLayer, planLayer, designLayer, dismantleLayer]
}

// 轨迹图层
export const initTrackLayers = (): LayerGroup[] => {
  // 勘察轨迹图层
  const surveyTrackLayers = new Group()
  surveyTrackLayers.set('name', 'surveyTrackLayers')

  // 交底轨迹图层
  const disclosureTrackLayers = new Group()
  disclosureTrackLayers.set('name', 'disclosureTrackLayers')

  return [surveyTrackLayers, disclosureTrackLayers]
}

// 状态
// export const initOtherLayersState = [
//   {
//     name: '勘察图层',
//     state: false,
//     index: 0,
//   },
//   {
//     name: '方案图层',
//     state: false,
//     index: 1,
//   },
//   {
//     name: '设计图层',
//     state: false,
//     index: 2,
//   },
//   {
//     name: '拆除图层',
//     state: false,
//     index: 3,
//   },
// ];

// view
export const initView = new View({
  center: proj.transform([104.08537388, 30.58850819], 'EPSG:4326', 'EPSG:3857'),
  zoom: 5,
  maxZoom: 25,
  minZoom: 1,
  projection: 'EPSG:3857',
})

export interface ControlLayearsData {
  name: string
  state: boolean
  index: number
}
