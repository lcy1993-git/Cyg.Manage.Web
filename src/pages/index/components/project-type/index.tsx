import React, { useState } from "react";
import ChartBox from "../chart-box";
import ChartTab from "../chart-tab";
import ProjectCategory from "../project-category";
import ProjectClassify from "../project-classify";
import ProjectLevel from "../project-level";
import ProjectStage from "../project-stage";
import styles from "./index.less";

const ProjectType: React.FC = () => {

    const tabData = [
        {
            id: "classify",
            name: "项目分类"
        },
        {
            id: "type",
            name: "项目类别"
        },
        {
            id: "stage",
            name: "项目阶段"
        },
        {
            id: "level",
            name: "电压等级"
        },
    ]

    const [activeKey, setActiveKey] = useState<string>("classify");

    return (
        <ChartBox title="项目类型">
            <div className={styles.projectType}>
                <div className={styles.projectTypeControl}>
                    <div className="flex1" />
                    <div className={styles.projectTypeControlTab}>
                        <ChartTab data={tabData} onChange={(value: string) => setActiveKey(value)} defaultValue="classify" />
                    </div>
                </div>

                <div className={styles.projectTypeChart}>
                    {
                        activeKey === "classify" &&
                        <ProjectClassify />
                    }
                    {
                        activeKey === "type" &&
                        <ProjectCategory />
                    }
                    {
                        activeKey === "stage" &&
                        <ProjectStage />
                    }
                    {
                        activeKey === "level" &&
                        <ProjectLevel />
                    }
                </div>
            </div>
        </ChartBox>
    )
}

export default ProjectType