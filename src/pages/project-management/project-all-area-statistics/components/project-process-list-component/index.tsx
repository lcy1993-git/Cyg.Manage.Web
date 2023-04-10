import EmptyTip from '@/components/empty-tip'
import { getCompanyProjectProgressRank } from '@/services/project-management/project-statistics-v2'
import { useRequest } from 'ahooks'
import uuid from 'node-uuid'
import React from 'react'
import ScrollView from 'react-custom-scrollbars'
import ProcessListItem from '../process-list-item'
import { useProjectAllAreaStatisticsStore } from '@/pages/project-management/project-all-area-statistics/store'
import styles from './index.less'

const ProjectProcessListComponent: React.FC = () => {
  const { companyInfo, projectShareCompanyId } = useProjectAllAreaStatisticsStore()

  const { data: projectData = [], loading } = useRequest(() =>
    getCompanyProjectProgressRank({
      projectShareCompanyId: companyInfo.companyId!,
      companyId: projectShareCompanyId,
      limit: 9999,
    })
  )

  const listElement = projectData
    ?.sort((a: any, b: any) => b.value - a.value)
    ?.map((item: any, index: number) => {
      return <ProcessListItem key={uuid.v1()} num={index + 1} rate={item.value} name={item.key} />
    })
  return (
    <div className={styles.projectProcessListContent}>
      <ScrollView>
        {projectData && projectData.length > 0 && !loading && (
          <div style={{ paddingRight: '14px', paddingTop: '20px' }}>{listElement}</div>
        )}
        {(!projectData || (projectData && projectData.length === 0)) && !loading && (
          <EmptyTip className={'pt20'} />
        )}
      </ScrollView>
    </div>
  )
}

export default ProjectProcessListComponent
