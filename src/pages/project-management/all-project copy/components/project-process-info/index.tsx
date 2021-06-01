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

    const allotsElement = allots?.map((item: any) => {
        let showTitle = "";
        switch(item.allotType) {
            case 1:
                showTitle = `项目委托给: ${item.allotOrganizeName}`;
            break;
            case 3:
                showTitle = `${item.allotOrganizeName} => 部组: ${item.allotCompanyGroupName}(${item.allotCompanyGroupAdmin})`;
                break;
            case 2:
                showTitle = item.allotOrganizeName
                break;    
        }
        
        return (
            <Timeline.Item key={uuid.v1()} color="#0E7B3B">
                <ProjectProcessItem time={item.allotTime} title={showTitle} isArrangePerson={item.isArrange} users={item.users} />
            </Timeline.Item>
        )
    })

    return (
        <div className={styles.projectProcessInfo}>
            <Timeline>
                <Timeline.Item color="#0E7B3B">
                    <ProjectProcessItem time={projectInfo.createdOn} title={`立项(${projectInfo.createdCompanyName}-${projectInfo?.engineerCreatedByName ? projectInfo.engineerCreatedByName : '无'})`} />
                </Timeline.Item>
                {
                    allotsElement
                }
            </Timeline>
        </div>
    )
}

export default ProjectProcessInfo