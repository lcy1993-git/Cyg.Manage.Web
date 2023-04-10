import { getObject } from '@/utils/utils'
import { Tabs } from 'antd'
import React from 'react'
import BaseInfo from '../base-info'
import ErrorTab from '../error-info'

const { TabPane } = Tabs

// TODO 参数声明,不能是any
interface SourceCompareTabProps {
  detailData: any
}

const SourceCompareDetailTab: React.FC<SourceCompareTabProps> = (props) => {
  const { detailData } = props

  return (
    <>
      <Tabs className="normalTabs" tabBarGutter={25}>
        <TabPane tab="基本信息" {...getObject('1')}>
          <BaseInfo baseInfo={detailData} />
        </TabPane>
        <TabPane tab="异常" {...getObject('2')}>
          <ErrorTab info={detailData} />
        </TabPane>
      </Tabs>
    </>
  )
}

export default SourceCompareDetailTab
