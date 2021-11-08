import React from 'react'
import styles from './index.less'

interface ImageIconProps {
  width?: number | string
  height?: number | string
  marginRight?: number | string
  // 指向/assets/icon-image目录
  imgUrl: string
  // 激活的image的url,也指向 /assets/icon-image目录
  activeImgUrl?: string
  active?: boolean
}

const ImageIcon: React.FC<ImageIconProps> = (props) => {
  const { width = 20, height = 20, marginRight, imgUrl, activeImgUrl, active = false } = props

  const needJointUrl = active ? activeImgUrl : imgUrl

  const imgSrc = require('../../assets/icon-image/' + needJointUrl + '')

  return (
    <img
      className={styles.imageIcon}
      style={{ width: `${width}px`, height: `${height}px`, marginRight: `${marginRight}px` }}
      src={imgSrc}
    />
  )
}

export default ImageIcon
