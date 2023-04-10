import React from 'react'
import styles from './index.less'

interface NumberStatisticsComponentProps {
  title: string
  num: number | string
  unit: string
}

const NumberStatisticsComponent: React.FC<NumberStatisticsComponentProps> = (props) => {
  const { title, num, unit } = props
  return (
    <div className={styles.numberStatisticsComponent}>
      <div className={styles.numberStatisticsComponentTitle}>{title}</div>
      <div className={styles.numberStatisticsComponentNumber}>
        <span className={styles.number}>{num}</span>
        <span className={styles.unit}>{unit}</span>
      </div>
    </div>
  )
}

export default NumberStatisticsComponent
