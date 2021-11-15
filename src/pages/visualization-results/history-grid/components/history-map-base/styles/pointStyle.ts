import '@/assets/icon/history-grid-icon.css'
import { Fill, Stroke } from 'ol/style'
import ClassStyle from 'ol/style/Style'
import Text from 'ol/style/Text'

const options = () => {
  return {
    font: 'Normal 24px iconfontHistoryGrid',
    // text: '\xe905',
    offsetX: 0,
    offsetY: -10,
    fill: new Fill({
      color: 'rgba(0, 117, 206, 1)',
    }),
    // stroke: new Stroke({
    //   color: 'rgba(255,255, 255, 1)',
    //   width: 2,
    // }),
  }
}

const hightOptions = () => {
  return {
    font: 'Normal 24px iconfontHistoryGrid',
    // text: '\xe905',
    offsetX: 0,
    offsetY: -10,
    fill: new Fill({
      color: 'rgba(255,255, 255, 1)',
    }),
    stroke: new Stroke({
      color: 'rgba(255,255, 255, 1)',
      width: 4,
    }),
  }
}

// const hightOptions = {
//   font: 'Normal 24px iconfontHistoryGrid',
//   // text: '\xe905',
//   offsetX: 0,
//   offsetY: -10,
//   fill: new Fill({
//     color: 'rgba(255,255, 255, 1)',
//   }),
//   stroke: new Stroke({
//     color: 'rgba(255,255, 255, 1)',
//     width: 4,
//   }),
// }

//   | '无类型'
//   | '开闭所'
//   | '环网柜'
//   | '分支箱'
//   | '配变'
//   | '联络开关'
//   | '分段开关'

const whiteCircle = new ClassStyle({
  text: new Text({
    text: '\ue879',
    ...hightOptions(),
  }),
})

const pointStyle = {
  // 无类型
  无类型: [
    whiteCircle,
    new ClassStyle({
      text: new Text({
        text: '\ue823',
        ...options(),
      }),
    }),
  ],
  开闭所: [
    whiteCircle,
    new ClassStyle({
      text: new Text({
        text: '\ue851',
        ...options(),
      }),
    }),
  ],
  环网柜: new ClassStyle({
    text: new Text({
      text: '\ue852',
      ...options(),
    }),
  }),
  分支箱: [
    whiteCircle,
    new ClassStyle({
      text: new Text({
        text: '\ue905',
        ...options(),
      }),
    }),
  ],
  配变: [
    whiteCircle,
    new ClassStyle({
      text: new Text({
        ...options(),
        text: '\ue904',
        fill: new Fill({
          color: 'rgba(255, 174, 40, 1)',
        }),
      }),
    }),
  ],
  联络开关: new ClassStyle({
    text: new Text({
      text: '\ue901',
      ...options(),
    }),
  }),
  分段开关: new ClassStyle({
    text: new Text({
      text: '\ue903',
      ...options(),
    }),
  }),
  // 分支箱
  t1: new ClassStyle({
    text: new Text({
      text: '\ue905',
      ...options(),
    }),
  }),
  // 配变
  t2: new ClassStyle({
    text: new Text({
      text: '\ue904',
      ...options(),
    }),
  }),
  // 环网箱
  t3: new ClassStyle({
    text: new Text({
      text: '\ue852',
      ...options(),
    }),
  }),
}

export default pointStyle
