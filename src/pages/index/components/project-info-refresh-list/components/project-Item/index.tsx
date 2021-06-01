import React, { FC } from 'react';
import styles from './index.less';
export interface ProjectItemProps {
  name: string;
  id: string;
  operation: string;
  operator: string;
}

const ProjectItem: FC<ProjectItemProps> = ({
  operator,
  name,
  id,
  operation,
}) => {
  return (
    <div className={styles.projectItem}>
      {operator}
      {operation}项目 &nbsp;
      {operation === '删除' ? (
        <span className={styles.deleteItem}>{name}</span>
      ) : (
        <a>{name}</a>
      )}
    </div>
  );
};
export default ProjectItem;
