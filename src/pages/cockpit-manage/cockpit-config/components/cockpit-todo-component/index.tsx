import React, { useContext } from 'react'
import { CockpitConfigContext } from '../../context'
import TodoComponent from '@/pages/index/components/to-do-second'

interface CockpitConfigTodoComponentProps {
  componentProps?: string[]
}

const CockpitTodoComponent: React.FC<CockpitConfigTodoComponentProps> = (props) => {
  const { currentAreaInfo } = useContext(CockpitConfigContext)

  return (
    <>
      <TodoComponent currentAreaInfo={currentAreaInfo} {...props} />
    </>
  )
}

export default CockpitTodoComponent
