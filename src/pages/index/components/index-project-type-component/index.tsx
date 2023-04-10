import React, { useContext } from 'react'
import { IndexContext } from '../../context'
import ProjectType from '../project-type'

interface IndexPorjectTypeProps {
  componentProps?: string[]
}

const IndexProjectProps: React.FC<IndexPorjectTypeProps> = (props) => {
  const { currentAreaInfo } = useContext(IndexContext)

  return (
    <>
      <ProjectType currentAreaInfo={currentAreaInfo} {...props} />
    </>
  )
}

export default IndexProjectProps
