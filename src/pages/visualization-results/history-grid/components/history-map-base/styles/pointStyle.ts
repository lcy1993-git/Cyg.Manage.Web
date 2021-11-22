import '@/assets/icon/history-grid-icon.css'
import { Fill, Stroke } from 'ol/style'
import ClassStyle from 'ol/style/Style'
import Text from 'ol/style/Text'
import { ElectricPointType, SourceType } from '../typings'

// 普通层
const whiteCircle = new ClassStyle({
  text: new Text({
    text: '\ue879',
    font: 'Normal 22px iconfontHistoryGrid',
    // text: '\xe905',
    // textAlign: "center",
    placement: 'line',
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
    // textAlign: "center",
    placement: 'point',
    font: 'Normal 26px iconfontHistoryGrid',
    fill: new Fill({
      color: SourceType.highLight,
    }),
  }),
})

interface PointOps {
  color?: string
}

export type GetPointStyle = (
  sourceType: keyof typeof SourceType,
  type: ElectricPointType,
  name: string,
  showText: boolean,
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
  sourceType: keyof typeof SourceType,
  type: ElectricPointType,
  name: string,
  showText: boolean = false,
  isHight: boolean = false,
  ops: PointOps = {}
): ClassStyle[] => {

  const fillColor = SourceType[sourceType]

  const textObjet = {
    无类型: '\ue823',
    开闭所: '\ue851',
    环网柜: '\ue852',
    分支箱: '\ue905',
    配变: '\ue904',
    联络开关: '\ue901',
    分段开关: '\ue903',
  }

  const baseStyle = [
    new ClassStyle({
      text: new Text({
        text: textObjet[type],
        placement: 'point',
        font: 'Normal 22px iconfontHistoryGrid',
        fill: new Fill({
          color: ops.color || fillColor,
        }),
      }),
    }),
  ]

  // 处理高亮图层
  baseStyle.unshift(isHight ? hightCircle : whiteCircle)

  // 处理设备名称
  if (showText) {
    const textStyle = new ClassStyle({
      // stroke: new Stroke(strokeOpts),
      text: new Text({
        text: name?.length > 10 ? `${name.slice(0, 10)}...` : name,
        textAlign: 'center',
        font: 'bold 12px Source Han Sans SC', //字体与大小
        // placement: 'line',
        offsetY: 20,
        fill: new Fill({
          //文字填充色
          color: isHight ? SourceType.highLight : fillColor,
        }),
      }),
    })
    baseStyle.push(textStyle)
  }
  return baseStyle
}
