import { Fill, Stroke, Style } from 'ol/style'
import ClassStyle from 'ol/style/Style'
import Text from 'ol/style/Text'
import { ElectricLineType, SourceType } from '../typings'

interface LineOps {
  color?: string
}

export type GetLineStyle = (
  sourceType: keyof typeof SourceType,
  type: ElectricLineType,
  name: string,
  showText: boolean,
  isHight?: boolean,
  ops?: LineOps
) => Style[]

/**
 * @description 获取LineStyle
 * @param {ElectricLineType} type 类型
 * @param {boolean} hight 是否为高亮 默认为false
 * @param {LineOps} ops 配置项，用于调整配置项部分细节
 * @returns {Style} ClassStyle 第一项表示背景层，第二项表示文本层
 * @example const style = getPointStyle("联络开关", true) //表示联络开关的的高亮类型
 */

export const getLineStyle: GetLineStyle = (
  sourceType: keyof typeof SourceType,
  type: ElectricLineType,
  name: string,
  showText: boolean = false,
  isHight: boolean = false,
  ops: LineOps = {}
) => {
  const fillColor = SourceType[sourceType]

  const textObject = {
    无类型: [],
    架空线: [2, 6],
    电缆: [1, 3],
  }

  const baseStyle = [
    new Style({
      stroke: new Stroke({
        //lineJoin:'bevel',
        lineDash: textObject[type],
        color: isHight ? SourceType.highLight : fillColor,
        width: isHight ? 3 : 2,
        ...ops,
      }),
    }),
  ]

  if (showText) {
    // 线路名称样式
    const styleMode = new ClassStyle({
      text: new Text({
        text: name?.length > 10 ? `${name.slice(0, 10)}...` : name,
        textAlign: 'center',
        font: '12px Source Han Sans SC', //字体与大小
        placement: 'line',
        offsetY: -10,
        fill: new Fill({
          //文字填充色
          color: isHight ? SourceType.highLight : fillColor,
        }),
        stroke: new Stroke({
          color: 'rgba(255,255,255,1)',
          width: 2,
        }),
      }),
    })

    baseStyle.push(styleMode)
  }

  return baseStyle
}
