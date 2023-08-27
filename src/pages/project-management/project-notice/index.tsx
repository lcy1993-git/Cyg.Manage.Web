/**
 * 全过程通报查询
 */
import CommonTitle from '@/components/common-title'
import PageCommonWrap from '@/components/page-common-wrap'

import { Tabs } from 'antd'
import React from 'react'

import styles from './index.less'
import ProjectTabs from './project-tabs'
import UserTabs from './user-tabs'

const { TabPane } = Tabs
const ProjectNotice: React.FC = () => {
  return (
    <PageCommonWrap noPadding={true}>
      <div className={styles.handover}>
        <div className={styles.moduleTitle}>
          <CommonTitle>全过程通报</CommonTitle>
        </div>
        <div className={styles.moduleHead}>
          <div className={styles.moduleTabs}>
            <Tabs type="card">
              <TabPane tab="用户统计" key="user">
                <UserTabs />{' '}
              </TabPane>
              <TabPane tab="项目统计" key="project">
                <ProjectTabs />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </PageCommonWrap>
  )
}

export default ProjectNotice
