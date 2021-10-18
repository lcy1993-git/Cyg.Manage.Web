import { Timeline } from "antd";
import uuid from "node-uuid";
import React from "react";
import ProjectProcessItem from "../project-process-item";
import { OperateLog } from '@/services/project-management/all-project';
import styles from "./index.less";

interface ProjectProcessInfoProps {
  operateLog: OperateLog[]
}

const ProjectProcessInfo: React.FC<ProjectProcessInfoProps> = ({ operateLog }) => {

  return (
    <div className={styles.projectProcessInfo}>
      <Timeline>
        {operateLog.map((item) => {
          return (
            <Timeline.Item key={uuid.v1()}>
              <ProjectProcessItem {...item} />
            </Timeline.Item>
          );

        })}
      </Timeline>
    </div>
  )
}

export default ProjectProcessInfo