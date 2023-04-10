import agentSrc from '@/assets/index/agent.png'
import approveSrc from '@/assets/index/approve.png'
import arrangeSrc from '@/assets/index/arrange.png'
import knotSrc from '@/assets/index/knot.png'
import React from 'react'
import styles from './index.less'

interface ToDoItemProps {
  type: string
  number: number
}

const statusObject = {
  agent: '项目获取',
  approve: '立项审批',
  arrange: '任务安排',
  // review: '评审管理',
  knot: '结项管理',
}

const imageObject = {
  agent: agentSrc,
  approve: approveSrc,
  arrange: arrangeSrc,
  // review: reviewSrc,
  knot: knotSrc,
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
