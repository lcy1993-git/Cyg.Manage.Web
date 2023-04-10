import { handleRate } from '@/utils/utils'
import React from 'react'
import styles from './index.less'

interface RateComponentProps {
  rate: number
}

const RateComponent: React.FC<RateComponentProps> = (props) => {
  const { rate = 0 } = props
  return (
    <div className={styles.rateComponent}>
      <div className={styles.rateComponentChart}>
        <div className={styles.rateComponentChartBg}></div>
        <div className={styles.rateComponentChartActual} style={{ width: `${rate}%` }}></div>
      </div>
      <div className={styles.rateComponentWord}>
        <span>{handleRate(rate)}%</span>
      </div>
    </div>
  )
}

export default RateComponent
