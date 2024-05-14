/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import s from './index.less'

interface IndexProps {
  width: number
  height: number
}
const LargeScreen: React.FC<IndexProps> = (props) => {
  const { width, height } = props
  const [scaleX, setScaleX] = useState<number>()
  const [scaleY, setScaleY] = useState<number>()

  //自适应函数
  const getScale = (width, height) => {
    const w = window.innerWidth / width
    const h = window.innerHeight / height
    return { x: w, y: h }
  }
  const setScale = (width, height) => {
    let { x, y } = getScale(width, height)
    setScaleX(x)
    setScaleY(y)
  }
  useEffect(() => {
    setScale(width, height)
    //监听浏览器缩放
    window.addEventListener('resize', () => {
      setScale(width, height)
    })
    return () => {
      window.onresize = null
    } //注销监听
  }, [])
  return (
    <div
      className={s['scale-box']}
      style={{
        transform: `scale(${scaleX},${scaleY}) translate(-50%, -50%)`,
        WebkitTransform: `scale(${scaleX},${scaleY}) translate(-50%, -50%)`,
        width: width,
        height: height,
      }}
    >
      {props.children}
    </div>
  )
}
export default LargeScreen
