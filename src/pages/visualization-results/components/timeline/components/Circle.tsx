import React, { FC } from 'react'
import { CircleProps } from '../index.d'
/**
 *
 * @param props
 * @returns
 *
 * 圆形svg组件
 * cx x坐标
 * cy y坐标
 * r 半径
 * stroke border颜色
 * fill 填充颜色
 *
 */
const Circle: FC<CircleProps> = (props: CircleProps) => {
  const { stroke, fill, strokeWidth, onClick } = props
  return (
    <circle
      cx="5.5"
      cy="10"
      r="5"
      onClick={onClick}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
    />
  )
}

export default Circle
