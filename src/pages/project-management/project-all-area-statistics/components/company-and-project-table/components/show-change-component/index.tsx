import React from 'react'
import ChangeNumberShowElement from '../change-number-show-element'

import styles from './index.less'

interface ShowChangeComponentProps {
  changeNumber: number
}

const ShowChangeComponent: React.FC<ShowChangeComponentProps> = (props) => {
  const { changeNumber } = props

  return (
    <div className={styles.showChangeComponent}>
      <div className={styles.actualNumber}>{props.children}</div>
      <div className={styles.changeNumber}>
        <ChangeNumberShowElement num={changeNumber} />
      </div>
    </div>
  )
}

export default ShowChangeComponent
