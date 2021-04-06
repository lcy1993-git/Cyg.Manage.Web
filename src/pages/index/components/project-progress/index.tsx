import React from "react";
import { useRequest} from "ahooks";
import ChartBox from "../chart-box";
import GanttView from "@/components/gantt-component-view-small";
import { getProjectGanttData } from "@/services/index";
import styles from "./index.less";
import { useMemo } from "react";

// interface Props {
//   componentProps?: string[];
// }

const ProjectProgress:React.FC = () => {

  const { data: requestData } = useRequest(() => getProjectGanttData({}));
  
  const handleRequestData = useMemo(() => {
    if(requestData) {
      return requestData.items.map((item: any) => item.projects).flat()
    }
    return []
  }, [JSON.stringify(requestData)])

  return (
      <ChartBox title="项目进度" titleAlign="left">
        <div className={styles.container}>
          <GanttView ganttData={handleRequestData}/>
        </div>
      </ChartBox>
  )
}

export default ProjectProgress;