import React, { FC, useRef } from 'react';
import styles from './index.less';
import { Tooltip } from 'antd';
import { useSize } from 'ahooks';
import { Link } from 'umi';
import { useLayoutStore } from '@/layouts/context';
export interface ProjectItemProps {
  name: string;
  id: string;
  content: string;
  date: string;
}

const ProjectItem: FC<ProjectItemProps> = ({ content, name, id, date }) => {

  const {setAllProjectSearchProjectName} = useLayoutStore();
 
  const onClickProject = () => {
    setAllProjectSearchProjectName(name)
  };

  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  /**
   * count表示是可视条数是多少
   *
   */

  return (
    <div ref={ref} className={styles.projectItem}>
      <Tooltip
        className={styles.tooltip}
        title={
          size && size.width! < 500 ? (
            <>
              <div>
                <span className={styles.content}>{content} </span>
                &nbsp;
                <a style={{ color: '#26f682' }} onClick={onClickProject}>
                  {name}
                </a>
              </div>
              <span>{date}</span>
            </>
          ) : null
        }
      >
        <div>
          <span className={styles.content}>{content} </span>
          &nbsp;
          <Link
            to={`/project-management/all-project`}
            
            className={styles.name}
            onClick={onClickProject}
          >
            {name}
          </Link>
        </div>
        <span>{date}</span>
      </Tooltip>
    </div>
  );
};
export default ProjectItem;
