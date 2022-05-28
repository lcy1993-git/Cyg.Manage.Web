import WKT from 'ol/format/WKT'
import { Fill, Stroke, Style, Text } from 'ol/style'
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
export const pointStyle = (data: any, selected: boolean = false) => {
  let text,
    font = 'gridManageIconfont'
  let color = `rgba(8,210,42,1)`
  switch (data.kvLevel) {
    case 7:
      color = `rgba(8,210,42,1)`
      break
    case 6:
      color = `rgba(64,56,31,1)`
      break
    case 5:
    case 4:
      color = `rgba(170,170,85,1)`
      break
    case 3:
      color = `rgba(212,212,0,1)`
      break
    default:
      break
  }
  // 根据点位的类型设置图符
  switch (data.featureType) {
    case POWERSUPPLY: // 电源
      if (data.powerType === '水电') text = '\ue11a'
      else if (data.powerType === '火电') text = '\ue124'
      else if (data.powerType === '风电') text = '\ue11a'
      else if (data.powerType === '光伏') text = '\ue119'
      else if (data.powerType === '生物质能') text = '\ue119'
      else text = '\ue11a'
      break
    case TRANSFORMERSUBSTATION: // 变电站
      if (data.kvLevel === 7)
        // 330KV
        text = '\ue12a'
      else if (data.kvLevel === 6)
        // 110KV
        text = '\ue127'
      else if (data.kvLevel === 5 || data.kvLevel === 4)
        // 35KV/20KV
        text = '\ue128'
      else text = '\ue12a'
      break

    case CABLEWELL: /* 电缆井 */
    case TOWER /* 杆塔 */:
      text = '\ue119'
      break
    case BOXTRANSFORMER /** 箱变 **/:
      text = '\ue11c'
      break
    case RINGNETWORKCABINET /* 环网柜 */:
      text = '\ue11d'
      break
    case ELECTRICITYDISTRIBUTIONROOM /* 配电室 */:
      text = '\ue11a'
      break
    case SWITCHINGSTATION /* 开闭所 */:
      text = '\ue125'
      break
    case COLUMNCIRCUITBREAKER /* 柱上断路器 */:
      text = '\ue11a'
      break
    case COLUMNTRANSFORMER /* 柱上变压器 */:
      text = '\ue118'
      break
    case CABLEBRANCHBOX /* 电缆分支箱 */:
      text = '\ue123'
      break

    default:
      break
  }

  color = selected ? `rgba(110, 74, 192, 1)` : color
  return new Style({
    text: new Text({
      font: 'Normal 28px ' + font,
      text,
      fill: new Fill({
        color: color,
      }),
      stroke: new Stroke({
        color: color,
        width: 1,
      }),
    }),
    // zIndex: zIndex
  })
}

export const lineStyle = (data: any, selected: boolean = false) => {
  let color = `rgba(8,210,42,1)`,
    width = 2
  switch (data.kvLevel) {
    case 7:
      color = `rgba(8,210,42,1)`
      break
    case 6:
      color = `rgba(64,56,31,1)`
      break
    case 5:
    case 4:
      color = `rgba(170,170,85,1)`
      break
    case 3:
      color = `rgba(212,212,0,1)`
      break
    default:
      break
  }
  color = selected ? `rgba(110, 74, 192, 1)` : color

  var format = new WKT()
  const geomtery: any = format.readGeometry(data.geom)
  const length = calculateDistance(geomtery.getCoordinates()[0], geomtery.getCoordinates()[1])

  data.conductorModel = data.conductorModel ? data.conductorModel : ''
  let text = `${data.conductorModel}   `
  text += length ? length.toFixed(2) + 'm' : ''
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
      font: '12px Source Han Sans SC',
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
    zIndex: 2,
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
  return distance
}
