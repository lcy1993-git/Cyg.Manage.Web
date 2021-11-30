import PageCommonWrap from '@/components/page-common-wrap'
import { useLayoutStore } from '@/layouts/context'
import { getMyWorkStatisticsData } from '@/services/project-management/all-project'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import useRequest from '@ahooksjs/use-request'
import { Spin, Tooltip } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useHistory } from 'umi'
import SingleStatistics from '../all-project/components/all-project-statistics'
import FavoriteList from '../all-project/components/favorite-list'
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
  const [selectedFavId, setSelectedFavId] = useState<string>('')
  const [statisticalCategory, setStatisticalCategory] = useState<string>('-1')
  const [favName, setFavName] = useState<string>('')
  const [indexToPageSearchParams, setIndexToPageSearchParams] = useState({
    requestUrl: '/ProjectList/GetAlls',
  })

  const { data, run: refreshStatistics, loading } = useRequest(() => getMyWorkStatisticsData(), {
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
              url: '/ProjectList/GetAlls',
            },
          ],
        },
        {
          label: '立项审批',
          id: 'approve',
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
          id: 'arrange',
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
              number: data.arrange.awaitAllotExternalReview,
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
          id: 'knot',
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

  const { allProjectSearchParams, setAllProjectSearchParams } = useLayoutStore()

  const history = useHistory()

  //@ts-ignore
  const favVisible = history.location.state?.sideVisible

  //收藏夹
  const buttonJurisdictionArray: any = useGetButtonJurisdictionArray()
  const [sideVisible, setSideVisible] = useState<boolean>(false)
  const imgSrc = require('../../../assets/icon-image/favorite.png')

  const singleStatisticsTypeClickEvent = (type: string) => {
    const childrenType = myWorkInitData.find((item) => item.id === type)?.children
    // 设置children的第一个是激活状态
    if (childrenType && childrenType.length > 0) {
      setCurrentClickTabChildActiveType(childrenType[0].id)
    }
    setCurrentClickType(type)

    const requestUrl = childrenType[0].url

    setIndexToPageSearchParams({
      requestUrl: requestUrl,
    })
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

  useEffect(() => {
    if (
      allProjectSearchParams &&
      allProjectSearchParams.searchType &&
      myWorkInitData &&
      myWorkInitData.length > 0
    ) {
      setCurrentClickType(allProjectSearchParams.searchType)
      const childrenType = myWorkInitData.find(
        (item) => item.id === allProjectSearchParams.searchType
      )?.children

      // 设置children的第一个是激活状态
      if (childrenType && childrenType.length > 0) {
        setCurrentClickTabChildActiveType(childrenType[0].id)
      }
      const requestUrl = myWorkInitData.find(
        (item) => item.id === allProjectSearchParams.searchType
      ).children[0].url

      setIndexToPageSearchParams({
        ...allProjectSearchParams,
        requestUrl: requestUrl,
      })

      setAllProjectSearchParams?.(undefined)
    }
  }, [allProjectSearchParams, myWorkInitData])

  useEffect(() => {
    setSideVisible(favVisible)
    setFavName('')
    setSelectedFavId('')
  }, [favVisible])

  return (
    <MyWorkProvider
      value={{
        myWorkInitData,
        indexToPageSearchParams,
        setIndexToPageSearchParams,
        currentClickTabType,
        selectedFavId,
        currentClickTabChildActiveType,
        sideVisible,
        favName,
        setSideVisible,
        setCurrentClickTabChildActiveType,
        refreshStatistics,
      }}
    >
      {buttonJurisdictionArray?.includes('engineer-favorite') && (
        <Tooltip title="工程收藏夹">
          <div
            className={styles.folderButton}
            onClick={() => {
              setSideVisible(true)
              setIndexToPageSearchParams({
                requestUrl: '/ProjectList/GetAlls',
              })
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
          {!sideVisible ? (
            <>
              <div className={styles.myWorkTypeContent}>{statisticsElement}</div>
              <div className={styles.singleTypeContent}>
                {loading && myWorkInitData.length === 0 && (
                  <div style={{ width: '100%', paddingTop: '120xpx', textAlign: 'center' }}>
                    <Spin spinning={loading} tip="数据加载中..."></Spin>
                  </div>
                )}
                {myWorkInitData.length > 0 && <MyProject />}
              </div>
            </>
          ) : (
            <div className={styles.projectsAndFavorite}>
              <div
                className={styles.allProjectsFavorite}
                style={{ display: sideVisible ? 'block' : 'none' }}
              >
                <Spin spinning={loading}>
                  <FavoriteList
                    getFavId={setSelectedFavId}
                    setVisible={setSideVisible}
                    setStatisticalTitle={setStatisticalCategory}
                    getFavName={setFavName}
                    favName={favName}
                    // finishEvent={refresh}
                    visible={sideVisible}
                  />
                </Spin>
              </div>
              <div className={styles.allProjectTableContent}>
                <MyProject />
              </div>
            </div>
          )}
        </div>
      </PageCommonWrap>
    </MyWorkProvider>
  )
}

export default MyWork
