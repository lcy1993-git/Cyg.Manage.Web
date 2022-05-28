import { Fill, Stroke, Style, Text } from 'ol/style'
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
  let color = selected ? `rgba(110, 74, 192, 1)` : `rgba(8,210,42,1)`
  switch (data.kvLevel) {
    case 5:
      color = `rgba(8,210,42,1)`
      break
    case 4:
      color = `rgba(64,56,31,1)`
      break
    case 3:
    case 1:
      color = `rgba(170,170,85,1)`
      break
    case 0:
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
      if (data.kvLevel === 5)
        // 330KV
        text = '\ue12a'
      else if (data.kvLevel === 4)
        // 110KV
        text = '\ue127'
      else if (data.kvLevel === 1 || data.kvLevel === 3)
        // 35KV/20KV
        text = '\ue128'
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
  return new Style({
    text: new Text({
      font: 'Normal 52px ' + font,
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
  let color,
    width = 2
  // switch (data.featureType) {
  //   case LINE:
  //     color = 'blue'
  //     width = 2
  //     break
  //   case CABLECIRCUIT:
  //     color = 'red'
  //     width = 2
  //     break
  //   default:
  //     break
  // }
  color = selected ? `rgba(8,210,42,1)` : 'blue'
  let text = data.length ? data.length.toFixed(2) + 'm' : ''
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
