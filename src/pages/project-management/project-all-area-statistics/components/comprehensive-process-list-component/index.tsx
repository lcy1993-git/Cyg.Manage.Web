import React from 'react'
import ProcessListItem from '../process-list-item'
import ScrollView from 'react-custom-scrollbars'
import styles from './index.less'
import { useRequest } from 'ahooks'
import { getProjectProgressRank } from '@/services/project-management/project-statistics-v2'
import uuid from 'node-uuid'
import EmptyTip from '@/components/empty-tip'
import { useProjectAllAreaStatisticsStore } from '../../store'

const ComprehensiveProcessListComponent: React.FC = () => {
  const { projectShareCompanyId } = useProjectAllAreaStatisticsStore()

  const { data: comprehensiveData = [], loading } = useRequest(
    () => getProjectProgressRank({ companyId: projectShareCompanyId, limit: 9999 }),
    {
      ready: !!projectShareCompanyId,
      refreshDeps: [projectShareCompanyId],
    }
  )

  const listElement = comprehensiveData
    ?.sort((a: any, b: any) => b.value - a.value)
    ?.map((item: any, index: number) => {
      return <ProcessListItem key={uuid.v1()} num={index + 1} rate={item.value} name={item.key} />
    })
  return (
    <div className={styles.comprehensiveProcessListContent}>
      <ScrollView>
        {comprehensiveData && comprehensiveData.length > 0 && !loading && (
          <div style={{ paddingRight: '14px', paddingTop: '20px' }}>{listElement}</div>
        )}
        {(!comprehensiveData || (comprehensiveData && comprehensiveData.length === 0)) &&
          !loading && <EmptyTip className={'pt20'} />}
      </ScrollView>
    </div>
  )
}

export default ComprehensiveProcessListComponent
