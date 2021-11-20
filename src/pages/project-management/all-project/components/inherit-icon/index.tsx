import { LinkOutlined } from '@ant-design/icons'
import React from 'react'

import styles from './index.less'

const InheritIcon: React.FC = () => {
  return (
    <span className={styles.inheritIcon}>
      <LinkOutlined />
    </span>
  )
}

export default InheritIcon
