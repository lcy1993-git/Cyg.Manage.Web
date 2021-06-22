import { Timeline } from 'antd';
import React, { FC } from 'react';
import styles from './index.less';
import ProjectScheduleItem from './components/project-shcedule-item';
export interface ProjectScheduleProps {}

const ProjectSchedule: FC<ProjectScheduleProps> = (props) => {
  return (
    <div className={styles.projectSchedule}>
      <Timeline>
        <Timeline.Item>
          <ProjectScheduleItem />
        </Timeline.Item>
      </Timeline>
    </div>
  );
};

export default ProjectSchedule;
