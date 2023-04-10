import React from 'react'
import styles from './index.less'

interface RankingComponentProps {
  num: number
}

const RankingComponent: React.FC<RankingComponentProps> = (props) => {
  return (
    <div className={`${styles.rankingComponent} ${props.num > 3 ? '' : styles.active}`}>
      <span>{props.num}</span>
    </div>
  )
}

export default RankingComponent
