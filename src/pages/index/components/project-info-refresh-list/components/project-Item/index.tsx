import React, { FC, useRef } from 'react';
import styles from './index.less';
import { Link } from 'umi';
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

  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /**
   * count表示是可视条数是多少
   *
   */

  return (
    <div ref={ref} className={styles.projectItem}>
      <div ref={contentRef} className={styles.content}>
        <span>{content} </span>
        &nbsp;
        <Link
          to={`/project-management/all-project`}
          className={styles.name}
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
