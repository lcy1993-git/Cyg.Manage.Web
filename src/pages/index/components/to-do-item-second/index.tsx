import React from 'react';
import styles from './index.less';
import awaitProcessSrc from '@/assets/index/awaitProcess.png';
import inProgressSrc from '@/assets/index/inProgress.png';
import delegationSrc from '@/assets/index/delegation.png';
import beSharedSrc from '@/assets/index/beShared.png';

interface ToDoItemProps {
  type: string;
  number: number;
}

const statusObject = {
  awaitProcess: '待处理',
  inProgress: '进行中',
  delegation: '委托',
  beShared: '被共享',
};

const imageObject = {
  awaitProcess: awaitProcessSrc,
  inProgress: inProgressSrc,
  delegation: delegationSrc,
  beShared: beSharedSrc,
};

const ToDoItem: React.FC<ToDoItemProps> = (props) => {
  const { type, number } = props;
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
  );
};

export default ToDoItem;
