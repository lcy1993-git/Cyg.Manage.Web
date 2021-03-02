import { Timeline } from "antd";
import uuid from "node-uuid";
import React from "react";
import ProjectProcessItem from "../project-process-item";
import styles from "./index.less";

interface ProjectProcessInfoProps {
    projectInfo: any
}

const ProjectProcessInfo: React.FC<ProjectProcessInfoProps> = (props) => {
    const { projectInfo = {} } = props;
    const { allots } = projectInfo;

    const allotsElement = allots.map((item: any) => {
        return (
            <Timeline.Item key={uuid.v1()} color="#0E7B3B">
                <ProjectProcessItem time={item.allotTime} title={item.allotOrganizeName} isArrangePerson={item.isArrange} users={item.users} />
            </Timeline.Item>
        )
    })

    return (
        <div className={styles.projectProcessInfo}>
            <Timeline>
                <Timeline.Item color="#0E7B3B">
                    <ProjectProcessItem time={projectInfo.createdOn} title={`立项(${projectInfo.createdCompanyName})`} />
                </Timeline.Item>
                {
                    allotsElement
                }
            </Timeline>
        </div>
    )
}

export default ProjectProcessInfo