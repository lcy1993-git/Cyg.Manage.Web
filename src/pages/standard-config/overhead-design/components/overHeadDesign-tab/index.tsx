import { Tabs } from 'antd'
import React from 'react'
import ModulesProperty from '../modules-property'
import PoleType from '../pole-type'

const { TabPane } = Tabs

interface CableDesignParams {
  libId: string
}
const OverHeadDesignTab: React.FC<CableDesignParams> = (props) => {
  const { libId } = props

  return (
    <Tabs className="normalTabs noMargin">
      <TabPane key="pole" tab="分类">
        <PoleType libId={libId} />
      </TabPane>
      <TabPane key="modules" tab="杆型">
        <ModulesProperty libId={libId} />
      </TabPane>
    </Tabs>
  )
}

export default OverHeadDesignTab
