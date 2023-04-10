import React from 'react'
import { useGetProjectStatisticsUrl } from './hooks'

const ProjectStatistics: React.FC = () => {
  const { webUrl } = useGetProjectStatisticsUrl()
  return <iframe width="100%" height="100%" src={webUrl}></iframe>
}

export default ProjectStatistics
