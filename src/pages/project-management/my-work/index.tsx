import PageCommonWrap from '@/components/page-common-wrap'
import React, { useMemo, useState } from 'react'
import SingleStatistics from '../all-project/components/all-project-statistics'
import MyProject from './components/my-project'
import { MyWorkProvider } from './context'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import styles from './index.less'
import { Tooltip } from 'antd'

export const myWorkTypeArray = [
  {
    label: '我的项目',
    id: 'allpro',
    number: 0,
    children: [
      {
        label: '我的项目',
        id: 'myAllProject',
        number: 0,
        url: '/ProjectList/GetAlls ',
      },
    ],
  },
  {
    label: '立项审批',
    id: 'approval',
    number: 0,
    children: [
      {
        label: '立项待审批',
        id: 'waitAudit',
        number: 0,
        url: '/ProjectList/GetAwaitApproves',
      },
      {
        label: '立项审批中',
        id: 'isAuditing',
        number: 0,
        url: '/ProjectList/GetApproveings',
      },
    ],
  },
  {
    label: '任务安排',
    id: 'mission',
    number: 0,
    children: [
      {
        label: '待安排',
        id: 'waitArrang',
        number: 0,
        url: '/ProjectList/GetAwaitAllots',
      },
      {
        label: '待安排评审',
        id: 'waitArrangAudit',
        number: 0,
        url: '/ProjectList/GetAwaitAllotExternalReviews',
      },
      {
        label: '公司待办',
        id: 'companyToDo',
        number: 0,
        url: '/ProjectList/GetAgents',
      },
    ],
  },
  {
    label: '评审管理',
    id: 'review',
    number: 0,
    children: [
      {
        label: '外审中',
        id: 'isOutAuditing',
        number: 0,
        url: '/ProjectList/GetExternalReviewings',
      },
    ],
  },
  {
    label: '结项管理',
    id: 'finish',
    number: 0,
    children: [
      {
        label: '待结项',
        id: 'waitFinish',
        number: 0,
        url: '/ProjectList/GetAwaitApplyKnots',
      },
      {
        label: '结项审批',
        id: 'auditFinish',
        number: 0,
        url: '/ProjectList/GetApproveKnots',
      },
    ],
  },
]

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
  const [currentClickTabChildActiveType, setCurrentClickTabChildActiveType] = useState(
    'myAllProject'
  )

  //收藏夹
  const buttonJurisdictionArray: any = useGetButtonJurisdictionArray()
  const [sideVisible, setSideVisible] = useState<boolean>(false)
  const imgSrc = require('../../../assets/icon-image/favorite.png')

  const singleStatisticsTypeClickEvent = (type: string) => {
    const childrenType = myWorkTypeArray.find((item) => item.id === type)?.children
    // 设置children的第一个是激活状态
    if (childrenType && childrenType.length > 0) {
      setCurrentClickTabChildActiveType(childrenType[0].id)
    }
    setCurrentClickType(type)
  }

  const statisticsElement = useMemo(() => {
    return myWorkTypeArray.map((item, index) => {
      return (
        <div
          className={styles.projectManagementStatisticItem}
          onClick={() => singleStatisticsTypeClickEvent(item.id)}
        >
          <SingleStatistics
            label={item.label}
            isLast={index === myWorkTypeArray.length - 1}
            icon={item.id}
            clickTab={currentClickTabType === item.id}
          >
            {handleStatisticsData(item?.number)}
          </SingleStatistics>
        </div>
      )
    })
  }, [myWorkTypeArray, currentClickTabType])

  return (
    <MyWorkProvider
      value={{
        currentClickTabType,
        currentClickTabChildActiveType,
        setCurrentClickTabChildActiveType,
      }}
    >
      {buttonJurisdictionArray?.includes('engineer-favorite') && (
        <Tooltip title="工程收藏夹">
          <div
            className={styles.folderButton}
            onClick={() => {
              setSideVisible(true)
            }}
            style={{ display: sideVisible || currentClickTabType !== 'allpro' ? 'none' : 'block' }}
          >
            <img src={imgSrc} alt="" />
            <div>收藏</div>
          </div>
        </Tooltip>
      )}
      <PageCommonWrap noPadding>
        <div className={styles.myWorkContent}>
          <div className={styles.myWorkTypeContent}>{statisticsElement}</div>
          <div className={styles.singleTypeContent}>
            <MyProject typeArray={myWorkTypeArray} />
          </div>
        </div>
      </PageCommonWrap>
    </MyWorkProvider>
  )
}

export default MyWork
