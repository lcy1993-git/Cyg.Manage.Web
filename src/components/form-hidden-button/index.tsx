import { DownOutlined, UpOutlined } from '@ant-design/icons'
import React from 'react'

import styles from './index.less'

interface Ipros {
  label: number
}

export const FormExpandButton: React.FC<Ipros> = (props) => {
  const { label } = props
  return (
    <div className={styles.wrap}>
      <span className={styles.text} style={{ transform: `translate(-${label / 2}px,0)` }}>
        更多属性
      </span>
      <DownOutlined style={{ color: '#0E7B3B', transform: `translate(-${label / 2}px,0)` }} />
    </div>
  )
}

export const FormCollaspeButton: React.FC<Ipros> = (props) => {
  const { label } = props
  return (
    <div className={styles.wrap}>
      <span className={styles.text} style={{ transform: `translate(-${label / 2}px,0)` }}>
        简要属性
      </span>
      <UpOutlined style={{ color: '#0E7B3B', transform: `translate(-${label / 2}px,0)` }} />
    </div>
  )
}
