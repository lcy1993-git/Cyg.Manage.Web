import CommonTitle from '@/components/common-title'
import PageCommonWrap from '@/components/page-common-wrap'
import { useLayoutStore } from '@/layouts/context'
import { useMount, useUnmount } from 'ahooks'
import { Tabs } from 'antd'
import qs from 'qs'
import React from 'react'
import CableDesign from '../cable-design'
import Component from '../component'
import Drawing from '../drawing'
import Material from '../material'
import OverheadDesign from '../overhead-design'
import styles from './index.less'

const { TabPane } = Tabs

const ResourceManage: React.FC = () => {
  const libId = qs.parse(window.location.href.split('?')[1]).libId as string
  const libName = qs.parse(window.location.href.split('?')[1]).libName as string

  const { setResourceManageFlag } = useLayoutStore()

  useMount(() => {
    setResourceManageFlag?.(true)
  })

  useUnmount(() => {
    setResourceManageFlag?.(false)
    window.localStorage.setItem('manageId', '')
  })

  return (
    <PageCommonWrap noPadding={true}>
      <div className={styles.resourceManage}>
        <div className={styles.moduleTitle}>
          <CommonTitle>{libName}</CommonTitle>
        </div>
        <div className={styles.moduleTabs}>
          <Tabs type="card">
            <TabPane tab="物料库" key="material">
              <div className={styles.pannelTable}>
                <Material libId={libId} />
              </div>
            </TabPane>
            <TabPane tab="组件库" key="component">
              <div className={styles.pannelTable}>
                <Component libId={libId} />
              </div>
            </TabPane>
            <TabPane tab="架空设计" key="overhead">
              <div className={styles.pannelTable}>
                <OverheadDesign libId={libId} />
              </div>
            </TabPane>
            <TabPane tab="电缆设计" key="cable">
              <div className={styles.pannelTable}>
                <CableDesign libId={libId} />
              </div>
            </TabPane>
            {/* <TabPane tab="电气设备" key="electric">
              <div className={styles.pannelTable}>
                <ElectricalEquipment libId={libId} />
              </div>
            </TabPane> */}
            <TabPane tab="图纸" key="drawing">
              <div className={styles.pannelTable}>
                <Drawing libId={libId} />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </PageCommonWrap>
  )
}

export default ResourceManage
