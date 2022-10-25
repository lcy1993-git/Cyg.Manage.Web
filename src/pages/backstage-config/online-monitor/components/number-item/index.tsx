import React from 'react'
import styles from './index.less'

interface NumberItemProps {
  size?: 'large' | 'small'
  account: number
  title: string
}
const NumberItem: React.FC<NumberItemProps> = (props) => {
  const { size, account = 0, title } = props
  const fontSize = size === 'large' ? 42 : 36

  return (
    <div className={styles.numberItem}>
      <div className={styles.number} style={{ fontSize: `${fontSize}px` }}>
        {account && account.toLocaleString()}
      </div>
      <div className={styles.title}>{title}</div>
    </div>
  )
}

export default NumberItem
