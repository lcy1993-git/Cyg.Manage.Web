import { Tooltip } from 'antd'
import React from 'react'
import RankingComponent from '../ranking-component'
import RateComponent from '../rate-component'
import styles from './index.less'

interface ProcessListItemProps {
  num: number
  name: string
  rate: number
}

const ProcessListItem: React.FC<ProcessListItemProps> = (props) => {
  const { num, name, rate } = props
  return (
    <div className={styles.processListItem}>
      <div className={styles.processListRanking}>
        <RankingComponent num={num} />
      </div>
      <div className={styles.processListName}>
        <Tooltip title={name} placement="topLeft">
          <span>{name}</span>
        </Tooltip>
      </div>
      <div className={styles.processListRate}>
        <RateComponent rate={rate} />
      </div>
    </div>
  )
}

export default ProcessListItem
