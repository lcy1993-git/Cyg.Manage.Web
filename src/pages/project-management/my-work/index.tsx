import PageCommonWrap from '@/components/page-common-wrap'
import { getMyWorkStatisticsData } from '@/services/project-management/all-project'
import useRequest from '@ahooksjs/use-request'
import { Spin } from 'antd'
import React, { useMemo, useState } from 'react'
import SingleStatistics from '../all-project/components/all-project-statistics'
import MyProject from './components/my-project'
import { MyWorkProvider } from './context'
import styles from './index.less'

const handleStatisticsData = (statisticsDataItem?: number) => {
  if (statisticsDataItem) {
    if (statisticsDataItem < 10) {
      return `0${statisticsDataItem}`
    }
    return statisticsDataItem
  }
  return '0'
}

const MyWork: React.FC = () => {
  const [currentClickTabType, setCurrentClickType] = useState('allpro')
  const [currentClickTabChildActiveType, setCurrentClickTabChildActiveType] = useState('my')
  const [myWorkInitData, setMyWorkInitData] = useState<any[]>([])
  const { data, loading } = useRequest(() => getMyWorkStatisticsData(), {
    onSuccess: () => {
      setMyWorkInitData([
        {
          label: '我的项目',
          id: 'allpro',
          number: data.all.total,
          children: [
            {
              label: '我的项目',
              id: 'my',
              number: data.all.my,
              url: '/ProjectList/GetAlls ',
            },
          ],
        },
        {
          label: '立项审批',
          id: 'approval',
          number: data.approve.total,
          children: [
            {
              label: '立项待审批',
              id: 'awaitApprove',
              number: data.approve.awaitApprove,
              url: '/ProjectList/GetAwaitApproves',
            },
            {
              label: '立项审批中',
              id: 'approveing',
              number: data.approve.approveing,
              url: '/ProjectList/GetApproveings',
              typeColumns: [
                'name',
                'dataSourceTypeText',
                'categoryText',
                'pTypeText',
                'kvLevelText',
                'natureTexts',
                'projectTime',
                'majorCategoryText',
                'reformAimText',
                'cityCompany',
                'countyCompany',
                'constructTypeText',
                'pCategoryText',
                'stageText',
                'pAttributeText',
                'disclosureRange',
                'pileRange',
                'batchText',
              ],
            },
          ],
        },
        {
          label: '任务安排',
          id: 'mission',
          number: data.arrange.total,
          children: [
            {
              label: '待安排',
              id: 'awaitAllot',
              number: data.arrange.awaitAllot,
              url: '/ProjectList/GetAwaitAllots',
            },
            {
              label: '待安排评审',
              id: 'waitArrangAudit',
              number: data.arrange.waitArrangAudit,
              url: '/ProjectList/GetAwaitAllotExternalReviews',
            },
            {
              label: '公司待办',
              id: 'agent',
              number: data.arrange.agent,
              url: '/ProjectList/GetAgents',
              typeColumns: [
                'name',
                'dataSourceTypeText',
                'categoryText',
                'pTypeText',
                'kvLevelText',
                'natureTexts',
                'projectTime',
                'majorCategoryText',
                'reformAimText',
                'cityCompany',
                'countyCompany',
                'constructTypeText',
                'pCategoryText',
                'stageText',
                'pAttributeText',
                'disclosureRange',
                'pileRange',
                'batchText',
              ],
            },
          ],
        },
        {
          label: '评审管理',
          id: 'review',
          number: data.review.total,
          children: [
            {
              label: '外审中',
              id: 'externalReviewing',
              number: data.review.externalReviewing,
              url: '/ProjectList/GetExternalReviewings',
            },
          ],
        },
        {
          label: '结项管理',
          id: 'finish',
          number: data.knot.total,
          children: [
            {
              label: '待结项',
              id: 'awaitApplyKnot',
              number: data.knot.awaitApplyKnot,
              url: '/ProjectList/GetAwaitApplyKnots',
            },
            {
              label: '结项审批',
              id: 'approveKnot',
              number: data.knot.approveKnot,
              url: '/ProjectList/GetApproveKnots',
            },
          ],
        },
      ])
    },
  })

  const singleStatisticsTypeClickEvent = (type: string) => {
    const childrenType = myWorkInitData.find((item) => item.id === type)?.children
    // 设置children的第一个是激活状态
    if (childrenType && childrenType.length > 0) {
      setCurrentClickTabChildActiveType(childrenType[0].id)
    }
    setCurrentClickType(type)
  }

  const statisticsElement = useMemo(() => {
    return myWorkInitData.map((item, index) => {
      return (
        <div
          className={styles.projectManagementStatisticItem}
          onClick={() => singleStatisticsTypeClickEvent(item.id)}
        >
          <SingleStatistics
            label={item.label}
            isLast={index === myWorkInitData.length - 1}
            icon={item.id}
            clickTab={currentClickTabType === item.id}
          >
            {handleStatisticsData(item?.number)}
          </SingleStatistics>
        </div>
      )
    })
  }, [myWorkInitData, currentClickTabType])

  return (
    <MyWorkProvider
      value={{
        myWorkInitData,
        currentClickTabType,
        currentClickTabChildActiveType,
        setCurrentClickTabChildActiveType,
      }}
    >
      <PageCommonWrap noPadding>
        <div className={styles.myWorkContent}>
          <div className={styles.myWorkTypeContent}>{statisticsElement}</div>
          <div className={styles.singleTypeContent}>
            {loading && myWorkInitData.length === 0 && (
              <div style={{ width: '100%', paddingTop: '120xpx', textAlign: 'center' }}>
                <Spin spinning={loading} tip="数据加载中..."></Spin>
              </div>
            )}
            {myWorkInitData.length > 0 && <MyProject />}
          </div>
        </div>
      </PageCommonWrap>
    </MyWorkProvider>
  )
}

export default MyWork
