import '@/assets/icon/history-grid-icon.css'
import { Fill, Stroke } from 'ol/style'
import ClassStyle from 'ol/style/Style'
import Text from 'ol/style/Text'

const options = {
  font: 'Normal 24px iconfontHistoryGrid',
  // text: '\xe905',
  offsetX: 0,
  offsetY: -10,
  fill: new Fill({
    color: 'rgba(0, 117, 206, 1)',
  }),
  stroke: new Stroke({
    color: 'rgba(255,255, 255, 1)',
    width: 2,
  }),
}
const hightOptions = {
  font: 'Normal 24px iconfontHistoryGrid',
  // text: '\xe905',
  offsetX: 0,
  offsetY: -10,
  fill: new Fill({
    color: 'rgba(200, 117, 206, 1)',
  }),
  stroke: new Stroke({
    color: 'rgba(255,255, 255, 1)',
    width: 4,
  }),
}

const pointStyle = {
  hight: new ClassStyle({
    text: new Text({
      text: '\ue823',
      ...hightOptions,
    }),
  }),
  // 无类型
  t0: new ClassStyle({
    text: new Text({
      text: '\ue823',
      ...options,
    }),
  }),
  // 分支箱
  t1: new ClassStyle({
    text: new Text({
      text: '\ue905',
      ...options,
    }),
  }),
  // 配变
  t2: new ClassStyle({
    text: new Text({
      text: '\ue904',
      ...options,
    }),
  }),
  // 环网箱
  t3: new ClassStyle({
    text: new Text({
      text: '\ue852',
      ...options,
    }),
  }),
}

export default pointStyle
