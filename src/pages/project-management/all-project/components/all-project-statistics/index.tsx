import React from 'react'
import styles from './index.less'

interface SingleStatisticsProps {
  label: string
  icon: string
  clickTab?: string
  // tipSlot?: () => React.ReactNode;
}

const SingleStatistics: React.FC<SingleStatisticsProps> = (props) => {
  const { label = '', icon = 'awaitProcess', clickTab = '' } = props

  const imgSrc = require('../../../../../assets/image/project-management/' + icon + '.png')
  const borderColorClass = clickTab ? styles.borderClass : ''

  return (
    <div className={`${styles.allStatistics} ${borderColorClass}`}>
      <div className={styles.allStatisticsIcon}>
        <img src={imgSrc} />
      </div>
      <div className={styles.allStatisticsContent}>
        <div className={styles.allStatisticsTitle}>{label}</div>
        <div className={styles.allStatisticsNumber}>
          {props.children} <span className={styles.singleTabUnit}> 个</span>
        </div>
      </div>
    </div>
  )
}

export default SingleStatistics
