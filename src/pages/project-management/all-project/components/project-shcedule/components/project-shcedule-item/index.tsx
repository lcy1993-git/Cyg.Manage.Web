import React, { FC } from 'react';
import styles from './index.less';
export interface ProjectScheduleItemProps {}

const ProjectScheduleItem: FC<ProjectScheduleItemProps> = (props) => {
  return (
    <div className={styles.projectScheduleItem}>
      <div className={styles.itemDate}>{new Date().toLocaleDateString()}</div>
      <div className={styles.itemContent}>创建测试（公司）</div>
    </div>
  );
};

export default ProjectScheduleItem;
