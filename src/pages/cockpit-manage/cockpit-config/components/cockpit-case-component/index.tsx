import React, { useContext } from 'react'
import { CockpitConfigContext } from '../../context'
import CaseComponent from '@/pages/index/components/project-schedule-status'

interface CockpitConfigCaseComponentProps {
  componentProps?: string[]
}

const CockpitCaseComponent: React.FC<CockpitConfigCaseComponentProps> = (props) => {
  const { currentAreaInfo } = useContext(CockpitConfigContext)

  return (
    <>
      <CaseComponent currentAreaInfo={currentAreaInfo} {...props} />
    </>
  )
}

export default CockpitCaseComponent
