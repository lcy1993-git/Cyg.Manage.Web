import React from "react";
import { useRequest} from "ahooks";
import ChartBox from "../chart-box";
import GanttView from "@/components/gantt-component-view";
import { getProjectGanttData } from "@/services/index";
import styles from "./index.less";

// interface Props {
//   componentProps?: string[];
// }

const ProjectProcess:React.FC = () => {

  const { data: ganttData } = useRequest(() => getProjectGanttData({}), {

  });
  // console.log(ganttData);
  return (
      <ChartBox title="项目进度" titleAlign="left">
        <div className={styles.container}>
          <GanttView ganttData={ganttData}/>
        </div>
      </ChartBox>
  )
}

export default ProjectProcess;