import React,{ Dispatch, SetStateAction } from "react"

import ReadonlyItem from "@/components/readonly-item";
import { getProjectInfo } from "@/services/project-management/all-project";
import { useControllableValue, useRequest } from "ahooks";
import { Modal, Tabs } from "antd"
import ProjectBaseInfo from "../project-base-info";

const {TabPane} = Tabs;

interface ProjectDetailInfoProps {
    projectId: string
    visible: boolean
    onChange: Dispatch<SetStateAction<boolean>>
}

const ProjectDetailInfo: React.FC<ProjectDetailInfoProps> = (props) => {
    const [state, setState] = useControllableValue(props, { valuePropName: "visible" });

    const { projectId } = props;

    const { data: projectInfo} = useRequest(() => getProjectInfo(projectId), {
        ready: !!projectId,
        refreshDeps: [projectId]
    })

    return (
        <Modal title="项目详情" width={680} bodyStyle={{padding: "0px"}} visible={state as boolean} footer={null} onCancel={() => setState(false)}>
            <Tabs className="normalTabs">
                <TabPane key="base" tab="基本信息">
                    <ProjectBaseInfo projectInfo={projectInfo} />
                </TabPane>
                <TabPane key="process" tab="项目进度">

                </TabPane>
            </Tabs>
        </Modal>
    )
}

export default ProjectDetailInfo