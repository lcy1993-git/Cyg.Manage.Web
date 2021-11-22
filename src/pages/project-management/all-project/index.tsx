import PageCommonWrap from '@/components/page-common-wrap'
import { useLayoutStore } from '@/layouts/context'
import {
  applyKnot,
  canEditArrange,
  checkCanArrange,
  deleteProject,
  getColumnsConfig,
  getProjectInfo,
  revokeAllot,
  revokeKnot,
} from '@/services/project-management/all-project'
import { removeCollectionEngineers } from '@/services/project-management/favorite-list'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { ExclamationCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { useMount, useRequest, useUpdateEffect } from 'ahooks'
import { Input, Menu, message, Modal, Tabs, Tooltip } from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import MyProject from '../my-work/components/my-project'
import ProjectEntrust from '../project-entrust'
import SingleStatistics from './components/all-project-statistics'
import { TableItemCheckedInfo } from './components/engineer-table/engineer-table-item'
import { ProjectListContext, useProjectListStore } from './context'
import styles from './index.less'

const { TabPane } = Tabs

const statisticsObject = {
  '-1': '全部项目',
  '1': '待处理项目',
  '2': '进行中的项目',
  '3': '委托的项目',
  '4': '被共享的项目',
}

const defaultParams = {
  category: [],
  stage: [],
  constructType: [],
  nature: [],
  kvLevel: [],
  status: [],
  majorCategory: [],
  pType: [],
  reformAim: [],
  classification: [],
  attribute: [],
  sourceType: [],
  identityType: [],
  areaType: '-1',
  areaId: '',
  dataSourceType: [],
  logicRelation: 2,
  startTime: '',
  endTime: '',
  designUser: '',
  surveyUser: '',
}

const AllProject: React.FC = () => {
  const [keyWord, setKeyWord] = useState<string>('')
  const [urlList, setUrlList] = useState<string>('1')
  const [statisticalCategory, setStatisticalCategory] = useState<string>('-1')
  // 从列表返回的数据中获取 TODO设置search的参数
  const [searchParams, setSearchParams] = useState({
    category: [],
    stage: [],
    constructType: [],
    nature: [],
    kvLevel: [],
    status: [],
    majorCategory: [],
    pType: [],
    reformAim: [],
    classification: [],
    attribute: [],
    sourceType: [],
    identityType: [],
    areaType: '-1',
    areaId: '',
    dataSourceType: [],
    logicRelation: 2,
    startTime: '',
    endTime: '',
    designUser: '',
    surveyUser: '',
  })

  const [statisticsData, setStatisticsData] = useState({
    total: 0,
    awaitProcess: 0,
    inProgress: 0,
    delegation: 0,
    beShared: 0,
  })

  const imgSrc = require('../../../assets/icon-image/favorite.png')

  const [tableSelectData, setTableSelectData] = useState<TableItemCheckedInfo[]>([])

  //收藏夹显示
  const [sideVisible, setSideVisible] = useState<boolean>(false)
  const [chooseColumns, setChooseColumns] = useState<string[]>([])
  const [currentClickTab, setCurrentClickTab] = useState<string>('1')
  const buttonJurisdictionArray: any = useGetButtonJurisdictionArray()

  const {
    setAllProjectSearchProjectId,
    allProjectSearchParams,
    allProjectSearchProjectId,
    setAllProjectSearchParams,
  } = useLayoutStore()

  const { data: columnsData, loading } = useRequest(() => getColumnsConfig(), {
    onSuccess: () => {
      setChooseColumns(
        columnsData
          ? JSON.parse(columnsData)
          : [
              'categoryText',
              'kvLevelText',
              'natureTexts',
              'majorCategoryText',
              'constructTypeText',
              'stageText',
              'exportCoordinate',
              'surveyUser',
              'designUser',
              'identitys',
            ]
      )
    },
  })

  const tableRef = useRef<HTMLDivElement>(null)

  const refresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.refresh()
    }
  }

  const searchByParams = (params: any) => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.searchByParams(params)
    }
  }

  const arrangeEvent = async () => {
    // setArrangeModalVisible(true);
    const projectIds = tableSelectData.map((item) => item.checkedArray).flat(1)
    if (projectIds.length === 0) {
      message.error('请至少选择一个项目')
      return
    }

    await checkCanArrange(projectIds)
  }

  useMount(() => {
    searchByParams({
      ...searchParams,
      keyWord,
      statisticalCategory,
    })
  })

  useEffect(() => {
    if (allProjectSearchProjectId) {
      // TODO 有projectName的时候设置projectName
      searchByParams({
        ...defaultParams,
        projectId: allProjectSearchProjectId,
      })
      setAllProjectSearchProjectId?.('')
      setSearchParams(defaultParams)
      setStatisticalCategory('-1')
      setKeyWord('')
    }
    if (allProjectSearchParams.searchType) {
      setSearchParams({
        ...defaultParams,
        areaType: allProjectSearchParams.areaLevel!,
        areaId: allProjectSearchParams.areaId!,
      })
      setAllProjectSearchParams?.({
        areaLevel: '-1',
        areaId: '',
        cityId: '',
        searchPerson: '',
        searchType: '',
      })
      setKeyWord('')
      setStatisticalCategory(allProjectSearchParams.searchType)
      searchByParams({
        ...defaultParams,
        statisticalCategory: allProjectSearchParams.searchType,
        areaType: allProjectSearchParams.areaLevel,
        areaId: allProjectSearchParams.areaId,
      })
    }

    if (allProjectSearchParams.searchPerson) {
      setSearchParams({
        ...defaultParams,
        surveyUser: String(allProjectSearchParams.searchPerson),
        logicRelation: 1,
        designUser: String(allProjectSearchParams.searchPerson),
        areaType: allProjectSearchParams.areaLevel!,
        areaId: allProjectSearchParams.areaId!,
      })
      setAllProjectSearchParams?.({
        areaLevel: '-1',
        areaId: '',
        cityId: '',
        searchPerson: '',
        searchType: '',
      })
      setStatisticalCategory('-1')
      setKeyWord('')
      // TODO 有人的时候设置人
      searchByParams({
        ...defaultParams,
        keyWord: '',
        statisticalCategory: '-1',
        surveyUser: String(allProjectSearchParams.searchPerson),
        logicRelation: 1,
        designUser: String(allProjectSearchParams.searchPerson),
        areaType: allProjectSearchParams.areaLevel!,
        areaId: allProjectSearchParams.areaId!,
      })
    }
  }, [allProjectSearchProjectId, JSON.stringify(allProjectSearchParams)])

  useEffect(() => {
    setUrlList(currentClickTab)
  }, [currentClickTab])

  return (
    <ProjectListContext.Provider value={{ urlList, setUrlList }}>
      {buttonJurisdictionArray?.includes('engineer-favorite') && (
        <Tooltip title="工程收藏夹">
          <div
            className={styles.folderButton}
            onClick={() => {
              setSideVisible(true)
              setKeyWord('')
            }}
            style={{ display: sideVisible || currentClickTab !== '1' ? 'none' : 'block' }}
          >
            <img src={imgSrc} alt="" />
            <div>收藏</div>
          </div>
        </Tooltip>
      )}
      <PageCommonWrap noPadding={true} noColor={true}>
        <div className={styles.allProjectPage}>
          <div className={styles.allProjectCheckTab}>
            <div
              className={styles.projectManagementStatisticItem}
              onClick={() => setCurrentClickTab('1')}
            >
              <SingleStatistics
                label="我的项目"
                icon="allpro"
                clickTab={currentClickTab === '1' ? '1' : ''}
              >
                22{/* {handleStatisticsData(statisticsData?.total)} */}
              </SingleStatistics>
            </div>
            <div
              className={styles.projectManagementStatisticItem}
              onClick={() => {
                setCurrentClickTab('2')
              }}
            >
              <SingleStatistics
                label="立项审批"
                icon="approval"
                clickTab={currentClickTab === '2' ? '2' : ''}
              >
                22{/* {handleStatisticsData(statisticsData?.total)} */}
              </SingleStatistics>
            </div>
            <div
              className={styles.projectManagementStatisticItem}
              onClick={() => setCurrentClickTab('3')}
            >
              <SingleStatistics
                label="任务安排"
                icon="mission"
                clickTab={currentClickTab === '3' ? '3' : ''}
              >
                22{/* {handleStatisticsData(statisticsData?.total)} */}
              </SingleStatistics>
            </div>
            <div
              className={styles.projectManagementStatisticItem}
              onClick={() => setCurrentClickTab('4')}
            >
              <SingleStatistics
                label="评审管理"
                icon="review"
                clickTab={currentClickTab === '4' ? '4' : ''}
              >
                22{/* {handleStatisticsData(statisticsData?.total)} */}
              </SingleStatistics>
            </div>
            <div
              className={styles.projectManagementStatisticItem}
              onClick={() => setCurrentClickTab('5')}
            >
              <SingleStatistics
                label="结项管理"
                icon="finish"
                clickTab={currentClickTab === '5' ? '5' : ''}
              >
                22{/* {handleStatisticsData(statisticsData?.total)} */}
              </SingleStatistics>
            </div>
          </div>
          {/* <div style={{ background: 'white' }}>111</div> */}
          <div className={styles.allProjectContent}>
            {currentClickTab === '1' && (
              <div className={styles.myProjectList}>
                <Tabs>
                  <TabPane
                    tab="我的项目"
                    key="mypro"
                    // className={styles.projectTabPane}
                    style={{ height: 'calc(100vh - 272px)' }}
                  >
                    <MyProject />
                  </TabPane>
                </Tabs>
              </div>
            )}
            {(currentClickTab === '2' ||
              currentClickTab === 'inApproval' ||
              currentClickTab === 'awaitApproval') && (
              <div className={styles.projectApprovalList}>
                <Tabs onChange={(value) => setCurrentClickTab(value)}>
                  <TabPane
                    tab="立项待审批"
                    key="awaitApproval"
                    style={{ height: 'calc(100vh - 272px)' }}
                  >
                    <MyProject />
                  </TabPane>
                  <TabPane
                    tab="立项审批中"
                    key="inApproval"
                    style={{ height: 'calc(100vh - 272px)' }}
                  >
                    <MyProject />
                  </TabPane>
                </Tabs>
              </div>
            )}
            {currentClickTab === '3' && (
              <div className={styles.taskArrangeList}>
                <Tabs>
                  <TabPane tab="待安排" key="toArrange">
                    <MyProject />
                  </TabPane>
                  <TabPane tab="待安排评审" key="toReview">
                    <MyProject />
                  </TabPane>
                  <TabPane
                    tab="公司待办"
                    key="todo"
                    // className={styles.projectTabPane}
                    style={{ height: 'calc(100vh - 272px)' }}
                  >
                    <ProjectEntrust />
                  </TabPane>
                </Tabs>
              </div>
            )}
            {currentClickTab === '4' && (
              <div className={styles.reviewManageList}>
                <Tabs>
                  <TabPane tab="外审中" key="outAudit">
                    <MyProject />
                  </TabPane>
                </Tabs>
              </div>
            )}
            {currentClickTab === '5' && (
              <div className={styles.finishProjectList}>
                <Tabs>
                  <TabPane tab="待结项" key="awaitFinish">
                    <MyProject />
                  </TabPane>
                  <TabPane tab="结项审批" key="finishApproval">
                    <MyProject />
                  </TabPane>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </PageCommonWrap>
    </ProjectListContext.Provider>
  )
}

export default React.memo(AllProject)
