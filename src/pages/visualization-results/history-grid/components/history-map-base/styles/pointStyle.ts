import '@/assets/icon/history-grid-icon.css'
import { Fill, Stroke } from 'ol/style'
import ClassStyle from 'ol/style/Style'
import Text from 'ol/style/Text'
import type { ElectricPointType } from '../typings'

// 普通层
const whiteCircle = new ClassStyle({
  text: new Text({
    text: '\ue879',
    font: 'Normal 22px iconfontHistoryGrid',
    // text: '\xe905',
    offsetX: 0,
    offsetY: 0,
    fill: new Fill({
      color: 'rgba(255,255, 255, 1)',
    }),
    stroke: new Stroke({
      color: 'rgba(255,255, 255, 1)',
      width: 4,
    }),
  }),
})

// 高亮层
const hightCircle = new ClassStyle({
  text: new Text({
    text: '\ue879',
    font: 'Normal 26px iconfontHistoryGrid',
    // text: '\xe905',
    offsetX: 0,
    offsetY: 0,
    fill: new Fill({
      color: 'rgba(249, 149, 52, 1)',
    }),

    // stroke: new Stroke({
    //   color: 'rgba(255,255, 255, 1)',
    //   width: 4,
    // }),
  }),
})

interface PointOps {
  fill: string
}

export type GetPointStyle = (
  type: ElectricPointType,
  isHight?: boolean,
  ops?: PointOps
) => ClassStyle[]

/**
 * @description 获取pointStyle
 * @param {ElectricPointType} type 类型
 * @param {boolean} isHight 是否为高亮 默认为false
 * @param {PointOps} ops 配置项，用于调整配置项部分细节
 * @returns {ClassStyle[]} ClassStyle 第一项表示背景层，第二项表示文本层
 * @example const style = getPointStyle("联络开关", true) //表示联络开关的的高亮类型
 */

export const getPointStyle: GetPointStyle = (
  type: ElectricPointType,
  isHight = false,
  ops: PointOps = {
    fill: 'rgba(0, 117, 206, 1)',
  }
): ClassStyle[] => {
  const textObjet = {
    无类型: '\ue823',
    开闭所: '\ue851',
    环网柜: '\ue852',
    分支箱: '\ue905',
    配变: '\ue904',
    联络开关: '\ue901',
    分段开关: '\ue903',
  }

  return [
    isHight ? hightCircle : whiteCircle,
    new ClassStyle({
      text: new Text({
        text: textObjet[type],
        font: 'Normal 22px iconfontHistoryGrid',
        offsetX: 0,
        offsetY: 0,
        fill: new Fill({
          color: ops.fill,
        }),
      }),
    }),
  ]
}

getPointStyle('无类型', true)
