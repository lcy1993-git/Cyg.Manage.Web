import React, { FC } from 'react';
import styles from './index.less';
// import { Link } from 'umi';
import User from '@/assets/image/project-management/user.svg';
// import { useLayoutStore } from '@/layouts/context';
export interface ProjectItemProps {
  name: string;
  id: string;
  content?: string;
  date: string;
  operator: string;
  operationCategory: string;
}

const ProjectItem: FC<ProjectItemProps> = ({ operator, name, operationCategory, date }) => {

  return (
    <div className={styles.projectItem}>
      <div className={styles.content}>
        <img src={User} style={{ marginRight: 8, width: '16px' }} />
        {operator}
      </div>
      <div className={styles.operationCategory}>
        {operationCategory}
      </div>
      <div className={styles.projectName}>
        {name}
      </div>
      <div className={styles.date}>{date}</div>
    </div>
  );
};
export default ProjectItem;
