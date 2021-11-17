import { Stroke, Style } from 'ol/style'
import type { ElectricLineType } from '../typings'

interface LineOps {
  color?: string
}

export type GetLineStyle = (type: ElectricLineType, isHight?: boolean, ops?: LineOps) => Style

/**
 * @description 获取LineStyle
 * @param {ElectricLineType} type 类型
 * @param {boolean} hight 是否为高亮 默认为false
 * @param {LineOps} ops 配置项，用于调整配置项部分细节
 * @returns {Style} ClassStyle 第一项表示背景层，第二项表示文本层
 * @example const style = getPointStyle("联络开关", true) //表示联络开关的的高亮类型
 */

export const getLineStyle: GetLineStyle = (
  type: ElectricLineType,
  isHight: boolean = false,
  ops: LineOps = {}
) => {
  const textObject = {
    无类型: [],
    架空线: [2, 6],
    电缆: [1, 3],
  }

  return new Style({
    stroke: new Stroke({
      //lineJoin:'bevel',
      lineDash: textObject[type],
      color: isHight ? 'rgba(249, 149, 52, 1)' : '#1294d0',
      width: isHight ? 3 : 2,
      ...ops,
    }),
  })
}
