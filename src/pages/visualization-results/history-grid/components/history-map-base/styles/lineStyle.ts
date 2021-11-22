import { Fill, Stroke, Style } from 'ol/style'
import ClassStyle from 'ol/style/Style'
import Text from 'ol/style/Text'
import type { ElectricLineType } from '../typings'

interface LineOps {
  color?: string
}

export type GetLineStyle = (
  mode: string,
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
  mode: string,
  type: ElectricLineType,
  name: string,
  showText: boolean = false,
  isHight: boolean = false,
  ops: LineOps = {}
) => {

  const fillColor = mode === "preDesign" ? 'rgba(20, 168, 107, 1)' : 'rgba(0, 117, 206, 1)'

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
        color: isHight ? 'rgba(249, 149, 52, 1)' : fillColor,
        width: isHight ? 3 : 2,
        ...ops,
      }),
    }),
  ]

  if (showText) {
    // 线路名称样式
    const styleMode = new ClassStyle({
      // stroke: new Stroke(strokeOpts),
      text: new Text({
        text: name?.length > 10 ? `${name.slice(0, 10)}...` : name,
        textAlign: 'center',
        font: 'bold 12px Source Han Sans SC', //字体与大小
        placement: 'line',
        offsetY: -10,
        fill: new Fill({
          //文字填充色
          color: isHight ? 'rgba(249, 149, 52, 1)' : fillColor,
        }),
        // stroke: new Stroke({
        //   //文字边界宽度与颜色
        //   color: isHight ? 'rgba(249, 149, 52, 1)' : 'rgba(21, 32, 32, 1)',
        //   width: 2,
        // }),
      }),
    })

    baseStyle.push(styleMode)
  }

  return baseStyle
  // return [
  //   new Style({
  //     stroke: new Stroke({
  //       //lineJoin:'bevel',
  //       lineDash: textObject[type],
  //       color: isHight ? 'rgba(249, 149, 52, 1)' : '#1294d0',
  //       width: isHight ? 3 : 2,
  //       ...ops,
  //     }),
  //   }),
  // ]
}
