import React, { useContext } from 'react'
import { IndexContext } from '../../context'
import ToDo from '../to-do-second'

interface IndexToDoComponentProps {
  componentProps?: string[]
}

const IndexToDoComponent: React.FC<IndexToDoComponentProps> = (props) => {
  const { currentAreaInfo } = useContext(IndexContext)

  return (
    <>
      <ToDo currentAreaInfo={currentAreaInfo} {...props} />
    </>
  )
}

export default IndexToDoComponent
