import { MinusSquareOutlined } from '@ant-design/icons'
import React from 'react'
import styles from './index.less'

const HasCheckItem: React.FC = (props) => {
  return (
    <div className={styles.hasCheckItem}>
      <span className={styles.hasCheckItemIcon}>
        <MinusSquareOutlined />
      </span>
      <span className={styles.hasCheckItemContent}>{props.children}</span>
      <div className={styles.hasCheckItemTip}>不可选</div>
    </div>
  )
}

export default HasCheckItem
