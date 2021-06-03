import React, { FC } from 'react';
import styles from './index.less';
export interface ProjectItemProps {
  name: string;
  id: string;
  content: string;
  date: string;
}

const ProjectItem: FC<ProjectItemProps> = ({ content, name, id, date }) => {
  const onClickProject = () => {
    localStorage.setItem('selectProject', id);

  };
  return (
    <div className={styles.projectItem}>
      {content} &nbsp;
      {content.includes('删除') ? (
        <span className={styles.deleteItem}>{name}</span>
      ) : (
        <a href='/project-management/all-project' className={styles.item} onClick={onClickProject}>
          {name}
        </a>
      )}
      <span style={{ float: 'right' }}>{date}</span>
    </div>
  );
};
export default ProjectItem;
