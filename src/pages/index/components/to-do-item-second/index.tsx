import awaitProcessSrc from '@/assets/index/awaitProcess.png'
import beSharedSrc from '@/assets/index/beShared.png'
import delegationSrc from '@/assets/index/delegation.png'
import inProgressSrc from '@/assets/index/inProgress.png'
import React from 'react'
import styles from './index.less'

interface ToDoItemProps {
  type: string
  number: number
}

const statusObject = {
  awaitProcess: '立项审批',
  inProgress: '任务安排',
  delegation: '评审管理',
  beShared: '结项管理',
}

const imageObject = {
  awaitProcess: awaitProcessSrc,
  inProgress: inProgressSrc,
  delegation: delegationSrc,
  beShared: beSharedSrc,
}

const ToDoItem: React.FC<ToDoItemProps> = (props) => {
  const { type, number } = props
  return (
    <div className={styles.toDoItem}>
      <div className={styles.toDoItemIcon}>
        <img src={imageObject[type]} />
      </div>
      <div className={styles.toDoItemContent}>
        <div className={styles.toDoItemNumber}>{number}</div>
        <div className={styles.toDoItemStatus}>{statusObject[type]}</div>
      </div>
    </div>
  )
}

export default ToDoItem
