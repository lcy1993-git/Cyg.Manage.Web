import React, { useMemo } from 'react'
import { useRequest } from 'ahooks'
import PageCommonWrap from '@/components/page-common-wrap'
import GanttView from '@/components/gantt-component-view'
import GanttViewHead from './components/gantt-view-head'
import { getProjectGanttData } from '@/services/index'
const ProjectGanttView: React.FC = () => {
  const { data: requestData } = useRequest(() => getProjectGanttData({}))
  const handleRequestData = useMemo(() => {
    if (requestData) {
      return requestData.items.map((item: any) => item.projects).flat()
    }
    return []
  }, [JSON.stringify(requestData)])
  return (
    <PageCommonWrap>
      <GanttViewHead />
      <GanttView ganttData={handleRequestData} />
    </PageCommonWrap>
  )
}

export default ProjectGanttView
