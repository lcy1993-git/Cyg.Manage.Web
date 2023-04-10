import React, { useContext } from 'react'
import { IndexContext } from '../../context'
import ProjectSituation from '../project-schedule-status'

interface IndexToDoComponentProps {
  componentProps?: string[]
}

const IndexProjectSituationComponent: React.FC<IndexToDoComponentProps> = (props) => {
  const { currentAreaInfo } = useContext(IndexContext)

  return (
    <>
      <ProjectSituation currentAreaInfo={currentAreaInfo} {...props} />
    </>
  )
}

export default IndexProjectSituationComponent
