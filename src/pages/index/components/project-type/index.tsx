import React, { useState, useMemo } from "react";
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

interface Props {
  componentProps?: string[]
}

const ProjectType: React.FC<Props> = (props) => {
  const { componentProps = ["building", "classify", "type", "stage", "level"] } = props;
  const [activeKey, setActiveKey] = useState<string>();
  const [typeChart, setTypeChart] = useState<"pie" | "bar">("pie");

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
  ];

  const showTabData = useMemo(() => {
    const filterData = tabData.filter((item) => componentProps.includes(item.id));
    if (filterData && filterData.length > 0) {
      setActiveKey(filterData[0].id)
    }
    return filterData
  }, [JSON.stringify(componentProps)])

    return (
        <ChartBox title="项目类型">
            <div className={styles.projectType}>
                <div className={styles.projectTypeControl}>
                  <div className={styles.typeSelect}>
                    <Select
                      bordered={false}
                      defaultValue={typeChart}
                      suffixIcon={<CaretDownOutlined/>}
                      onChange={(v)=> setTypeChart(v)}>
                      <Option value="pie">饼状图</Option>
                      <Option value="bar">柱状图</Option>
                    </Select>
                  </div>
                  <div className="flex1" />
                  <div className={styles.projectTypeControlTab}>
                      <ChartTab data={showTabData} onChange={(value: string) => setActiveKey(value)} defaultValue={activeKey} />
                  </div>
                </div>

                <div className={styles.projectTypeChart}>
                    {
                        activeKey === "building" &&
                        <ProjectBuilding type={typeChart} />
                    }
                    {
                        activeKey === "classify" &&
                        <ProjectClassify type={typeChart} />
                    }
                    {
                        activeKey === "type" &&
                        <ProjectCategory type={typeChart} />
                    }
                    {
                        activeKey === "stage" &&
                        <ProjectStage type={typeChart} />
                    }
                    {
                        activeKey === "level" &&
                        <ProjectLevel type={typeChart} />
                    }
                </div>
            </div>
        </ChartBox>
    )
}

export default ProjectType