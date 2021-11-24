import { GemotType } from '../typings'
import { GetLineStyle, getLineStyle } from './lineStyle'
import { GetPointStyle, getPointStyle } from './pointStyle'

/**
 *
 * @param {GemotType} type
 * @returns {(ElectricLineType | ElectricPointType, string, boolean, string, boolean, LineOps | PointOps) => Style}
 * @example
 * getStyle("Point")("分支箱","name", true)
 * 表示获取点元素的高亮分支箱类型
 */

function getStyle(type: 'Point'): GetPointStyle
function getStyle(type: 'LineString'): GetLineStyle
function getStyle(type: GemotType) {
  return type === 'Point' ? getPointStyle : getLineStyle
}

export { getStyle }
