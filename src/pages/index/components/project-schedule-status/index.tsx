import React, { useMemo, useState } from "react";
import ChartBox from "../chart-box";
import ChartTab from "../chart-tab";
import ProjectNatures from "../project-natures";
import StatusBar from "../project-status-bar";
import styles from "./index.less";


interface TabData {
  id: string;
  name: string;
}

const ProjectSchedule:React.FC = () => {

  const tabData: TabData[]= [
    {
      id: "schedule",
      name: "项目性质"
    },
    {
      id: "status",
      name: "项目状态"
    }
  ];

  const [activeKey, setActiveKey] = useState<string>("schedule");

  // const getTabs = useMemo(()=> {
  //   return tabData.map((item) => {
  //     return (
  //       <div className={styles.tab} key={item.id}>{item.title}</div>
  //     )
  //   })
  // }, [JSON.stringify(tabData)])


  return (
      <ChartBox title="项目情况" titleAlign="left">
        <div className={styles.container}>
          <div className={styles.projectControl}>
            <div className={styles.flex1} />
            <div className={styles.tabs}>

              <ChartTab data={tabData} onChange={(v: string) => setActiveKey(v)} defaultValue="schedule" />
            </div>
          </div>

          <div className={styles.content}>
            {
              activeKey === "schedule" ? 
              <ProjectNatures /> : null
            }
            {
              activeKey === "status" ? 
              <StatusBar /> : null
            }
          </div>
        </div>
      </ChartBox>
  )
}

export default ProjectSchedule