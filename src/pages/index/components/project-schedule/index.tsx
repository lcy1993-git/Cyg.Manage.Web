import React from 'react'
import ChartBox from '../chart-box'
import ProjectNatures from '../project-natures'

const ProjectSchedule: React.FC = () => {
  return (
    <ChartBox title="项目性质" titleAlign="left">
      <ProjectNatures />
    </ChartBox>
  )
}

export default ProjectSchedule
