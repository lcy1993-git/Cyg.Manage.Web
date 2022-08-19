import React from 'react'
import { DownOutlined, UpOutlined } from '@ant-design/icons'

import styles from './index.less'

export const FormExpandButton: React.FC = (props) => {
  return (
    <div className={styles.wrap}>
      <span className={styles.text}>更多属性</span>
      <DownOutlined style={{ color: '#0E7B3B' }} />
    </div>
  )
}

export const FormCollaspeButton: React.FC = (props) => {
  return (
    <div className={styles.wrap}>
      <span className={styles.text}>简要属性</span>
      <UpOutlined style={{ color: '#0E7B3B' }} />
    </div>
  )
}
