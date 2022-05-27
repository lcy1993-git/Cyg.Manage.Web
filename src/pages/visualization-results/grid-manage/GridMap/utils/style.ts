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
  let text
  let color = selected ? `rgba(8,210,42,1)` : `rgba(145, 145, 255, 1)`
  // 根据点位的类型设置图符
  switch (data.featureType) {
    case POWERSUPPLY:
      text = '\ue86d'
      break
    case TRANSFORMERSUBSTATION:
      text = '\ue86d'
      break
    case CABLEWELL:
      text = '\ue869'
      break
    case TOWER:
      text = '\ue870'
      break
    case BOXTRANSFORMER:
      text = '\ue863'
      break
    case RINGNETWORKCABINET:
      text = '\ue84f'
      break
    case ELECTRICITYDISTRIBUTIONROOM:
      text = '\ue85b'
      break
    case SWITCHINGSTATION:
      text = '\ue849'
      break
    case COLUMNCIRCUITBREAKER:
      text = '\ue85a'
      break
    case COLUMNTRANSFORMER:
      text = '\ue84a'
      break
    case CABLEBRANCHBOX:
      text = '\ue845'
      break

    default:
      break
  }
  return new Style({
    text: new Text({
      font: 'Normal 22px webgisIconFont',
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
