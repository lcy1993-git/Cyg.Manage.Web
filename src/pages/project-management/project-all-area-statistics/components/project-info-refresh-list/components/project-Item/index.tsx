import React, { FC } from 'react';
import styles from './index.less';
import { Link } from 'umi';
import User from '@/assets/image/project-management/user.svg';
import { useLayoutStore } from '@/layouts/context';
export interface ProjectItemProps {
  name: string;
  id: string;
  content: string;
  date: string;
}

const ProjectItem: FC<ProjectItemProps> = ({ content, name, id, date }) => {
  const { setAllProjectSearchProjectId: setAllProjectSearchProjectId } = useLayoutStore();

  const onClickProject = () => {
    // setAllProjectSearchProjectId(name);
    setAllProjectSearchProjectId(id);
  };

  /**
   * count表示是可视条数是多少
   *
   */

  return (
    <div className={styles.projectItem}>
      <div className={styles.content}>
        <img src={User} style={{ marginRight: 8,width: "16px" }} />
        {content}
      </div>
      <div className={styles.projectName}>
        <Link
          to={`/project-management/all-project`}
          className={styles.projectName}
          onClick={onClickProject}
        >
          {name}
        </Link>
      </div>
      <div className={styles.date}>{date}</div>
    </div>
  );
};
export default ProjectItem;
