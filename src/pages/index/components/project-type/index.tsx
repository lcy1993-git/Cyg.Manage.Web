import React, { useState } from "react";
import { CaretDownOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import ChartBox from "../chart-box";
import ChartTab from "../chart-tab";
import ProjectBuilding from "../project-building";
import ProjectCategory from "../project-category";
import ProjectClassify from "../project-classify";
import ProjectLevel from "../project-level";
import ProjectStage from "../project-stage";
const { Option } = Select;

import styles from "./index.less";

const ProjectType: React.FC = () => {

    const tabData = [
        {
            id: "building",
            name: "建设类型"
        },
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
    const [type, setType] = useState<"pie" | "bar">("pie");

    return (
        <ChartBox title="项目类型">
            <div className={styles.projectType}>
                <div className={styles.projectTypeControl}>
                  <div className={styles.typeSelect}>
                    <Select
                      bordered={false}
                      defaultValue={type}
                      suffixIcon={<CaretDownOutlined/>}
                      onChange={(v)=> setType(v)}>
                      <Option value="pie">饼状图</Option>
                      <Option value="bar">柱状图</Option>
                    </Select>
                  </div>
                  <div className="flex1" />
                  <div className={styles.projectTypeControlTab}>
                      <ChartTab data={tabData} onChange={(value: string) => setActiveKey(value)} defaultValue="classify" />
                  </div>
                </div>

                <div className={styles.projectTypeChart}>
                    {
                        activeKey === "building" &&
                        <ProjectBuilding type={type} />
                    }
                    {
                        activeKey === "classify" &&
                        <ProjectClassify type={type} />
                    }
                    {
                        activeKey === "type" &&
                        <ProjectCategory type={type} />
                    }
                    {
                        activeKey === "stage" &&
                        <ProjectStage type={type} />
                    }
                    {
                        activeKey === "level" &&
                        <ProjectLevel type={type} />
                    }
                </div>
            </div>
        </ChartBox>
    )
}

export default ProjectType