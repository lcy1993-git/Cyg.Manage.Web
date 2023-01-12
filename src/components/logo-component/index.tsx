import logonSrc from '@/assets/image/logo.png'
import { webConfig } from '@/global'
import React from 'react'

interface LogoComponentProps {
  className?: string
}

const LogoComponent: React.FC<LogoComponentProps> = (props) => {
  const { className, ...rest } = props
  const thisHostName = window.location.hostname
  const imgName = webConfig.logoUrl[thisHostName]
  const imgSrc = imgName ? require('../../assets/image/' + imgName + '') : logonSrc
  return <img src={imgSrc} {...rest} className={className} alt="logo" />
}

export default LogoComponent
