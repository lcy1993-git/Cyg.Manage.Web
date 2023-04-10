import React, { useContext } from 'react'
import { CockpitConfigContext } from '../../context'
import PersonnelLoadComponent from '@/pages/index/components/personnel-load'

interface CockpitPersonnelLoadComponentProps {
  componentProps?: string[]
}

const CockpitPersonnelLoadComponent: React.FC<CockpitPersonnelLoadComponentProps> = (props) => {
  const { currentAreaInfo } = useContext(CockpitConfigContext)

  return (
    <>
      <PersonnelLoadComponent currentAreaInfo={currentAreaInfo} {...props} />
    </>
  )
}

export default CockpitPersonnelLoadComponent
