import WKT from 'ol/format/WKT'
import { getVectorContext } from 'ol/render'
import { Circle, Fill, Stroke, Style, Text } from 'ol/style'
import proj4 from 'proj4'
import {
  BOXTRANSFORMER,
  CABLEBRANCHBOX,
  CABLEWELL,
  COLUMNCIRCUITBREAKER,
  COLUMNTRANSFORMER,
  ELECTRICITYDISTRIBUTIONROOM,
  POWERSUPPLY,
  RINGNETWORKCABINET,
  SWITCHINGSTATION,
  TOWER,
  TRANSFORMERSUBSTATION,
} from '../../DrawToolbar/GridUtils'
import Configs from './config'
import { getCheckedValues, getLayer } from './loadLayer'
var postrender: any = null
export const pointStyle = (
  data: any,
  selected: boolean,
  level: number,
  isDraw: boolean = false
) => {
  let text,
    font = 'gridManageIconfont',
    zIndex = 3
  // 根据点位的类型设置图符
  switch (data.featureType) {
    case POWERSUPPLY: // 电源
      if (data.powerType === '水电') text = '\ue614'
      else if (data.powerType === '火电') text = '\ue609'
      else if (data.powerType === '风电') text = '\ue61c'
      else if (data.powerType === '光伏') text = '\ue60a'
      else if (data.powerType === '生物质能') text = '\ue61b'
      else text = '\ue614'
      break
    case TRANSFORMERSUBSTATION: // 变电站
      if (Number(data.kvLevel) === 7)
        // 330KV
        text = '\ue617'
      else if (Number(data.kvLevel) === 6)
        // 110KV
        text = '\ue618'
      else if (Number(data.kvLevel) === 5 || Number(data.kvLevel) === 4)
        // 35KV/20KV
        text = '\ue61a'
      else text = '\ue617'
      break

    case CABLEWELL /* 电缆井 */:
      text = '\ue840'
      break
    case TOWER /* 杆塔 */:
      text = '\ue608'
      break
    case BOXTRANSFORMER /** 箱变 **/:
      text = '\ue613'
      break
    case RINGNETWORKCABINET /* 环网柜 */:
      text = '\ue611'
      break
    case ELECTRICITYDISTRIBUTIONROOM /* 配电室 */:
      text = '\ue60f'
      break
    case SWITCHINGSTATION /* 开闭所 */:
      text = '\ue612'
      break
    case COLUMNCIRCUITBREAKER /* 柱上断路器 */:
      text = '\ue616'
      break
    case COLUMNTRANSFORMER /* 柱上变压器 */:
      text = '\ue615'
      break
    case CABLEBRANCHBOX /* 电缆分支箱 */:
      text = '\ue619'
      break

    default:
      break
  }

  let color = data.color
  color = selected ? `rgba(110, 74, 192, 1)` : color
  zIndex = selected ? 99 : zIndex

  const config = Configs.find((item: any) => item.name === data.featureType)
  const size = config && config.size ? config.size : 22

  color = config && config.zoom && !isDraw && level < config.zoom ? 'rgba(110, 74, 192, 0)' : color

  let styles = [
    new Style({
      text: new Text({
        font: `Normal ${size}px ${font}`,
        text,
        fill: new Fill({
          color: color,
        }),
        stroke: new Stroke({
          color: color,
          width: 1,
        }),
      }),
      zIndex: zIndex,
    }),
  ]
  if ((config && config.textZoom && level > config.textZoom) || (config && !config.textZoom))
    styles.push(
      new Style({
        text: new Text({
          font: '14px Source Han Sans SC',
          text: data.name ? data.name : '',
          fill: new Fill({
            //文字填充色
            color: 'white',
          }),
          stroke: new Stroke({
            //文字边界宽度与颜色
            color: 'rgba(21, 32, 32, 1)',
            width: 2,
          }),
          offsetX: 1,
          offsetY: 20,
        }),
        zIndex: zIndex,
      })
    )
  return styles
}

export const lineStyle = (data: any, selected: boolean = false) => {
  let width = 4,
    zIndex = 2

  let color = data.color
  color = selected ? `rgba(110, 74, 192, 1)` : color
  zIndex = selected ? 99 : zIndex

  var format = new WKT()
  const geomtery: any = format.readGeometry(data.geom)
  const length = calculateDistance(geomtery.getCoordinates()[0], geomtery.getCoordinates()[1])

  data.lineModel = data.lineModel ? data.lineModel : ''
  let text = `${data.lineModel}   `
  text += length ? length.toFixed(1) + 'm' : ''
  let style = new Style({
    stroke: new Stroke({
      color,
      lineCap: 'butt',
      width,
    }),
    fill: new Fill({
      color,
    }),
    text: new Text({
      font: '16px Source Han Sans SC',
      text,
      placement: 'line',
      textAlign: 'center',
      fill: new Fill({
        //文字填充色
        color: `rgba(255,255,255,1)`,
      }),
      stroke: new Stroke({
        //文字边界宽度与颜色
        color: `rgba(0,0,0,1)`,
        width: 2,
      }),
    }),
    zIndex: zIndex,
  })
  return style
}

export const calculateDistance = (startLont: any, endLont: any) => {
  // 获取UTM坐标系的epsg值
  let zid = Math.round((startLont[0] + endLont[0]) / 2 / 6 + 31)
  let start = 32601
  let epsg = start + zid - 1
  // 通过proj4将wgs84坐标转成UTM投影坐标
  let code = 'EPSG:' + epsg
  let info = '+proj=utm +zone=' + zid + ' +datum=WGS84 +units=m +no_defs'
  proj4.defs([[code, info]])
  let startLontUTM = proj4('EPSG:4326', code, startLont)
  let endLonttUTM = proj4('EPSG:4326', code, endLont)
  // 计算距离
  let distance = Math.sqrt(
    (startLontUTM[0] - endLonttUTM[0]) ** 2 + (startLontUTM[1] - endLonttUTM[1]) ** 2
  )
  distance = parseFloat(distance.toFixed(1))
  return distance
}

// 图层闪烁功能
export const twinkle = (map: any, types: any) => {
  const layer = getLayer(map, 'pointLayer')
  const features = layer.getSource().getFeatures()
  let radius = 0
  if (postrender) delete layer.listeners_.postrender
  if (!types || types.length === 0) return

  postrender = layer.on('postrender', (evt: any) => {
    if (radius >= 20) radius = 0
    let opacity = ((20 - radius) / 2) * 0.1
    const ctx = getVectorContext(evt)
    ctx.setStyle(
      new Style({
        image: new Circle({
          radius,
          stroke: new Stroke({
            color: `rgba(255,0,0,${opacity})`,
            width: 3,
          }),
        }),
      })
    )
    features.forEach((element: any) => {
      const checkedValues = getCheckedValues()
      if (
        types.indexOf(element.get('data').featureType) > -1 &&
        checkedValues.indexOf(element.get('data').featureType) > -1
      )
        ctx.drawGeometry(element.getGeometry())
    })
    radius += 0.4
    // map.render()
    layer.changed()
  })
  layer.changed()
}

export const twinkle_ = (map: any, types: any) => {
  let radius = 0
  const pointLayer = getLayer(map, 'pointLayer')
  const features = pointLayer
    .getSource()
    .getFeatures()
    .filter((item: any) => types.indexOf(item.get('data').featureType) > -1)
  if (radius >= 20) radius = 0

  features.forEach((element: any) => {
    if (element.get('data').featureType === type) ctx.drawGeometry(element.getGeometry())
  })
  radius += 0.4
}

export const stopTwinkle = (layer: any) => {
  if (postrender) layer.un('postrender', postrender)
}
