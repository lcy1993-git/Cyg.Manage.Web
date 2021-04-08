import React from "react";
import { useRequest} from "ahooks";
import ChartBox from "../chart-box";
import GanttView from "@/components/gantt-component-view-small";
import { getProjectGanttData, AreaInfo } from "@/services/index";
import styles from "./index.less";
import { useMemo } from "react";

interface Props {
  componentProps?: string[];
  currentAreaInfo: AreaInfo;
}

const ProjectProgress:React.FC<Props> = (props) => {
  const { currentAreaInfo } = props;
  const { data: requestData } = useRequest(() => getProjectGanttData({ areaCode: currentAreaInfo.areaId, areaType: currentAreaInfo.areaLevel }), {refreshDeps: [currentAreaInfo]});
  
  const handleRequestData = useMemo(() => {
    if(requestData) {
      return requestData.items?.map((item: any) => item.projects).flat()
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