import React from 'react'
import styles from './index.less'

interface OverdueItemProps {
  overdueNumber: number
}

const OverdueItem: React.FC<OverdueItemProps> = (props) => {
  const { overdueNumber = 0 } = props
  return (
    <div className={styles.overdueItem}>
      <div className={styles.overdueCompanyName}>{props.children}</div>
      <div className={styles.overdueNumber}>{overdueNumber}条</div>
    </div>
  )
}

export default OverdueItem
