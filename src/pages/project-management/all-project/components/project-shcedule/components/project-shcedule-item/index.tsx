import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import React, { FC } from 'react';
import styles from './index.less';
import finished from '@/assets/project-schedule-icon/finished.svg';
import hasNotStarted from '@/assets/project-schedule-icon/hasNotStarted.svg';
import processing from '@/assets/project-schedule-icon/processing.svg';
export interface ProjectScheduleItemProps {
  date?:string;
  content?: string;
  state?: number;
}

const ProjectScheduleItem: FC<ProjectScheduleItemProps> = (props) => {
  const { date, content, state } = props;
  return (
    <div className={styles.projectScheduleItem}>
      <div className={styles.itemInfo}>
        <div className={styles.itemDate}>
          <ClockCircleOutlined style={{ marginRight: '10px' }} />
          {date}
        </div>
        <div className={styles.itemContent}>
          <UserOutlined style={{ marginRight: '10px' }} />
          {content}
        </div>
      </div>

      <div className={styles.itemState}>
        <img src={finished} alt="" />
      </div>
    </div>
  );
};

export default ProjectScheduleItem;
