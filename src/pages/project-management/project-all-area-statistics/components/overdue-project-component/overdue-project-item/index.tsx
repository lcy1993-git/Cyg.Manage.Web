import React from 'react'
import styles from './index.less'

interface OverdueProjectItemProps {
  name: string
  status: string
}

const OverdueProjectItem: React.FC<OverdueProjectItemProps> = (props) => {
  const { name, status } = props
  return (
    <div className={styles.overdueItem}>
      <div className={styles.overdueCompanyName}>{name}</div>
      <div className={styles.overdueNumber}>{status}</div>
    </div>
  )
}

export default OverdueProjectItem
