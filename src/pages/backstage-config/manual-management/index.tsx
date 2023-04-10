import Tabs from 'antd/lib/tabs'
import React, { useState } from 'react'
import ManualUpload from './components/tab-child'
import styles from './index.less'
import PageCommonWrap from '@/components/page-common-wrap'
import { useMount } from 'ahooks'
import { getCategorys } from '@/services/system-config/manual-management'

const { TabPane } = Tabs

const ManualManagement: React.FC = () => {
  const [tabList, setTabList] = useState<{ value: number; text: string }[]>([])
  const callback = () => {}
  const getTabList = async () => {
    const res = await getCategorys()
    setTabList(res)
  }
  useMount(() => {
    getTabList()
  })
  return (
    <PageCommonWrap>
      <div className={styles.manualManagement}>
        <div className={styles.mainBox}>
          <Tabs defaultActiveKey="manageEnd" onChange={callback}>
            {tabList.map((item) => {
              return (
                <TabPane tab={item.text} key={item.value}>
                  <ManualUpload id={item.value} tabList={tabList} />
                </TabPane>
              )
            })}
          </Tabs>
        </div>
      </div>
    </PageCommonWrap>
  )
}

export default ManualManagement
