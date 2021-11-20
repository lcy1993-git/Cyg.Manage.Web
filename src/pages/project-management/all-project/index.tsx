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
import { default as React, useEffect, useMemo, useRef, useState } from 'react'
import MyProject from '../my-work/components/my-project'
import ProjectEntrust from '../project-entrust'
import SingleStatistics from './components/all-project-statistics'
import { TableItemCheckedInfo } from './components/engineer-table/engineer-table-item'
import styles from './index.less'

const { Search } = Input
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

  // 外审安排的时候用到
  const [currentProjectId, setCurrentProjectId] = useState<string>('')
  const [projectName, setProjectName] = useState<string>('')

  // 安排的时候需要用到
  const [currentArrangeProjectType, setCurrentArrangeProjectType] = useState<string>('2')
  const [currentArrangeProjectIsArrange, setCurrentArrangeProjectIsArrange] = useState<string>('')
  const [selectProjectIds, setSelectProjectIds] = useState<string[]>([])
  const [dataSourceType, setDataSourceType] = useState<number>()

  // 编辑安排的时候需要用到的数据
  const [editCurrentAllotCompanyId, setEditCurrentAllotCompanyId] = useState<string>('')
  const [ifCanEdit, setIfCanEdit] = useState<any>([])

  // 撤回共享的时候用到
  const [currentRecallProjectId, setCurrentRecallProjectId] = useState<string>('')
  // 被勾选中的数据
  const [tableSelectData, setTableSelectData] = useState<TableItemCheckedInfo[]>([])
  const [chooseColumns, setChooseColumns] = useState<string[]>([])

  //添加收藏夹modal
  const [addFavoriteModal, setAddFavoriteModal] = useState<boolean>(false)
  const [favName, setFavName] = useState<string>('')

  //收藏夹显示
  const [sideVisible, setSideVisible] = useState<boolean>(false)
  const [engineerIds, setEngineerIds] = useState<string[]>([])
  const [selectedFavId, setSelectedFavId] = useState<string>('')

  const [addEngineerModalVisible, setAddEngineerModalVisible] = useState(false)
  const [batchAddEngineerModalVisible, setBatchAddEngineerModalVisible] = useState(false)
  const [screenModalVisible, setScreenModalVisible] = useState(false)
  const [arrangeModalVisible, setArrangeModalVisible] = useState(false)
  const [editArrangeModalVisible, setEditArrangeModalVisible] = useState<boolean>(false)
  const [editExternalArrangeModal, setEditExternalArrangeModal] = useState<boolean>(false)
  const [externalArrangeModal, setExternalArrangeModal] = useState<boolean>(false)
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false)
  const [recallModalVisible, setRecallModalVisible] = useState(false)

  const [exportPowerModalVisible, setExportPowerModalVisible] = useState<boolean>(false)
  const [projectAuditKnotModal, setProjectAuditKnotModal] = useState<boolean>(false)
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

  const delayRefresh = async () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      await tableRef.current.delayRefresh()
    }
  }

  const handleStatisticsData = (statisticsDataItem?: number) => {
    if (statisticsDataItem) {
      if (statisticsDataItem < 10) {
        return `0${statisticsDataItem}`
      }
      return statisticsDataItem
    }
    return '0'
  }

  const statisticsClickEvent = (statisticsType: string) => {
    setStatisticalCategory(statisticsType)
    searchByParams({
      ...searchParams,
      engineerFavoritesId: selectedFavId,
      statisticalCategory: statisticsType,
      keyWord,
    })
  }

  const canDelete = useMemo(() => {
    return tableSelectData
      .map((item) => item.projectInfo.status)
      .flat()
      .filter((item) => item.inheritStatus === 1 || item.inheritStatus === 3)
  }, [JSON.stringify(tableSelectData)])

  useUpdateEffect(() => {
    setTableSelectData([])
    searchByParams({
      ...searchParams,
      engineerFavoritesId: selectedFavId,
      keyWord,
    })
  }, [selectedFavId])

  const addEngineerEvent = () => {
    setAddEngineerModalVisible(true)
  }

  const batchAddEngineerEvent = () => {
    setBatchAddEngineerModalVisible(true)
  }

  const deleteConfirm = () => {
    if (tableSelectData && tableSelectData.length === 0) {
      message.error('请至少勾选一条数据')
      return
    }
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定删除选中工程项目吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: sureDeleteProject,
    })
  }

  const sureDeleteProject = async () => {
    const projectIds = tableSelectData.map((item) => item.checkedArray).flat()
    await deleteProject(projectIds)
    message.success('删除成功')
    // search();
    refresh()
  }

  const arrangeEvent = async () => {
    // setArrangeModalVisible(true);
    const projectIds = tableSelectData.map((item) => item.checkedArray).flat(1)
    if (projectIds.length === 0) {
      message.error('请至少选择一个项目')
      return
    }

    await checkCanArrange(projectIds)

    // 如果只有一个项目需要安排的时候，需要去检查他是不是被安排了部组
    if (projectIds.length === 1) {
      const thisProjectId = projectIds[0]
      const projectInfo = await getProjectInfo(thisProjectId)
      setDataSourceType(Number(projectInfo.dataSourceType))
      const { allots = [] } = projectInfo ?? {}
      if (allots?.length > 0) {
        const latestAllot = allots[allots?.length - 1]
        const { allotType, allotCompanyGroup } = latestAllot
        if (allotType) {
          setCurrentArrangeProjectType(String(allotType))
        } else {
          setCurrentArrangeProjectType('2')
        }
        if (allotCompanyGroup) {
          setCurrentArrangeProjectIsArrange(allotCompanyGroup)
        } else {
          setCurrentArrangeProjectIsArrange('')
        }
      } else {
        setCurrentArrangeProjectType('2')
        setCurrentArrangeProjectIsArrange('')
      }
    } else {
      //根据现场数据来源数组 判断点击安排进入后的提示信息
      const typeArray = tableSelectData.map((item) => item.projectInfo.dataSourceType).flat(1)
      console.log(typeArray)
      if (typeArray?.length != 1 && !typeArray?.includes(0)) {
        setDataSourceType(-1)
      }
      if (typeArray?.every((item) => item === typeArray[0]) && typeArray?.includes(1)) {
        setDataSourceType(1)
      }
      if (typeArray?.every((item) => item === typeArray[0]) && typeArray?.includes(2)) {
        setDataSourceType(2)
      }
    }

    setSelectProjectIds(projectIds)
    setArrangeModalVisible(true)
  }

  const editArrangeEvent = async () => {
    const projectIds = tableSelectData?.map((item) => item.checkedArray).flat(1)

    if (projectIds.length === 1) {
      const thisProjectId = projectIds[0]
      const projectInfo = await getProjectInfo(thisProjectId)
      setDataSourceType(Number(projectInfo.dataSourceType))
    }

    if (projectIds && projectIds.length === 0) {
      message.error('请选择修改安排的项目！')
      return
    }
    if (tableSelectData[0]?.projectInfo?.status[0]?.status === 7) {
      message.error('当前处于设计完成，不可修改安排！')
      return
    }
    // if (
    //   (tableSelectData[0]?.projectInfo?.status[0]?.status === 17 &&
    //     tableSelectData[0]?.projectInfo?.status[0]?.auditStatus === 13) ||
    //   (tableSelectData[0]?.projectInfo?.status[0]?.status === 17 &&
    //     tableSelectData[0]?.projectInfo?.status[0]?.auditStatus === 15)
    // ) {
    //   setCurrentProjectId(tableSelectData[0]?.checkedArray[0]);

    //   setEditExternalArrangeModal(true);
    //   return;
    // }
    if (
      tableSelectData[0]?.projectInfo?.status[0]?.status === 8 &&
      tableSelectData[0]?.projectInfo?.status[0]?.auditStatus === 95
    ) {
      setCurrentProjectId(tableSelectData[0]?.checkedArray[0])
      setProjectName(tableSelectData[0]?.projectInfo?.name[0])

      setExternalArrangeModal(true)
      return
    }
    const resData = await canEditArrange(projectIds)

    const { allotCompanyGroup = '' } = resData

    setIfCanEdit(resData)
    const typeArray = tableSelectData.map((item) => item.projectInfo.dataSourceType).flat(1)
    console.log(typeArray)
    if (typeArray?.length != 1 && typeArray?.includes(0)) {
      setDataSourceType(0)
    }
    if (typeArray?.length != 1 && !typeArray?.includes(0)) {
      setDataSourceType(-1)
    }
    if (typeArray?.every((item) => item === typeArray[0]) && typeArray?.includes(1)) {
      setDataSourceType(1)
    }
    if (typeArray?.every((item) => item === typeArray[0]) && typeArray?.includes(2)) {
      setDataSourceType(2)
    }
    setEditCurrentAllotCompanyId(allotCompanyGroup)
    setSelectProjectIds(projectIds)
    setEditArrangeModalVisible(true)
  }

  const revokeAllotEvent = async () => {
    const projectIds = tableSelectData.map((item) => item.checkedArray).flat()

    if (projectIds.length === 0) {
      message.error('请至少选择一个项目')
      return
    }
    await revokeAllot(projectIds)
    message.success('撤回安排成功')
    refresh()
  }

  const shareEvent = async () => {
    const projectIds = tableSelectData.map((item) => item.checkedArray).flat()
    if (projectIds.length === 0) {
      message.error('请至少选择一个项目')
      return
    }

    setSelectProjectIds(projectIds)
    setShareModalVisible(true)
  }

  const recallShareEvent = async () => {
    const projectIds = tableSelectData.map((item) => item.checkedArray).flat()
    if (projectIds.length === 0) {
      message.error('请至少选择一个项目')
      return
    }

    if (projectIds.length > 1) {
      message.error('只能对一个项目进行撤回共享操作')
      return
    }

    setCurrentRecallProjectId(projectIds[0])
    setRecallModalVisible(true)
  }

  const applyConfirm = () => {
    if (tableSelectData && tableSelectData.length === 0) {
      message.error('请至少选择一个项目')
      return
    }
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定申请结项吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: applyKnotEvent,
    })
  }

  const applyKnotEvent = async () => {
    const projectIds = tableSelectData.map((item) => item.checkedArray).flat()
    await applyKnot(projectIds)
    message.success('申请结项成功')
    refresh()
  }

  const revokeConfirm = () => {
    if (tableSelectData && tableSelectData.length === 0) {
      message.error('请至少选择一个项目')
      return
    }
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定撤回结项吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: revokeKnotEvent,
    })
  }

  const revokeKnotEvent = async () => {
    const projectIds = tableSelectData.map((item) => item.checkedArray).flat()
    await revokeKnot(projectIds)
    message.success('撤回结项成功')
    refresh()
  }

  const auditKnotEvent = async () => {
    if (tableSelectData && tableSelectData.length === 0) {
      message.warning('请至少选择一条数据')
      return
    }
    const projectIds = tableSelectData?.map((item) => item.checkedArray).flat(1)
    setSelectProjectIds(projectIds)
    setProjectAuditKnotModal(true)
  }

  const searchEvent = () => {
    // TODO
    searchByParams({
      ...searchParams,
      engineerFavoritesId: selectedFavId,
      statisticalCategory,
      keyWord,
    })
  }

  // 导出坐标权限
  const exportPowerEvent = () => {
    if (tableSelectData && tableSelectData.length === 0) {
      message.warning('请至少选择一条数据')
      return
    }
    const projectIds = tableSelectData?.map((item) => item.checkedArray).flat(1)
    setSelectProjectIds(projectIds)
    setExportPowerModalVisible(true)
  }

  const tableSelectEvent = (checkedValue: TableItemCheckedInfo[]) => {
    const selectData = checkedValue
      .map((item: any) => {
        if (item.checkedArray.length === 0) {
          return null
        }
        return item
      })
      .filter(Boolean)

    const engineerIds = selectData.map((item: any) => item.projectInfo.id)
    setEngineerIds(engineerIds)
    setTableSelectData(checkedValue)
  }

  const addEngineerMenu = (
    <Menu>
      {buttonJurisdictionArray?.includes('all-project-project-approval') && (
        <Menu.Item onClick={() => addEngineerEvent()}>立项</Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('all-project-batch-project') && (
        <Menu.Item onClick={() => batchAddEngineerEvent()}>批量立项</Menu.Item>
      )}
    </Menu>
  )

  const arrangeMenu = (
    <Menu>
      {buttonJurisdictionArray?.includes('all-project-arrange-project') && (
        <Menu.Item onClick={() => arrangeEvent()}>安排</Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('all-project-edit-arrange') && (
        <Menu.Item onClick={() => editArrangeEvent()}>修改安排</Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('all-project-recall-project') && (
        <Menu.Item onClick={() => revokeAllotEvent()}>撤回安排</Menu.Item>
      )}
    </Menu>
  )

  const shareMenu = (
    <Menu>
      {buttonJurisdictionArray?.includes('all-project-share') && (
        <Menu.Item onClick={() => shareEvent()}>共享</Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('all-project-share-recall') && (
        <Menu.Item onClick={() => recallShareEvent()}>撤回共享</Menu.Item>
      )}
    </Menu>
  )

  const removeFavEvent = async () => {
    await removeCollectionEngineers({ id: selectedFavId, engineerIds: engineerIds })
    message.success('已移出当前收藏夹')
    searchByParams({
      ...searchParams,
      engineerFavoritesId: selectedFavId,
      keyWord,
    })
  }

  const removeConfirm = () => {
    if (!sideVisible) {
      message.warning('该功能仅能在收藏夹项目列表中使用')
      return
    }
    if (!selectedFavId) {
      message.warning('您还未选择收藏夹')
      return
    }
    if (engineerIds && engineerIds.length === 0) {
      message.warning('请选择要移出当前收藏夹的工程')
      return
    }
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定要移除所选工程',
      okText: '确认',
      cancelText: '取消',
      onOk: removeFavEvent,
    })
  }

  //收藏夹操作
  const favoriteMenu = (
    <Menu>
      {buttonJurisdictionArray?.includes('add-favorite-project') && (
        <Menu.Item key="add" onClick={() => addFavEvent()}>
          添加至收藏夹
        </Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('remove-favorite-project') && (
        <Menu.Item key="out" onClick={() => removeConfirm()}>
          移出当前收藏夹
        </Menu.Item>
      )}
    </Menu>
  )

  const addFavEvent = () => {
    if (engineerIds && engineerIds.length > 0) {
      setAddFavoriteModal(true)
      return
    }
    message.warning('您还未选择任何工程')
  }

  const postProjectMenu = (
    <Menu>
      {buttonJurisdictionArray?.includes('all-project-apply-knot') && (
        <Menu.Item key="apply" onClick={() => applyConfirm()}>
          申请结项
        </Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('all-project-recall-apply-knot') && (
        <Menu.Item key="revoke" onClick={() => revokeConfirm()}>
          撤回结项
        </Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('all-project-kont-approve') && (
        <Menu.Item key="audit" onClick={() => auditKnotEvent()}>
          结项审批
        </Menu.Item>
      )}
    </Menu>
  )

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

  const configChangeEvent = (config: any) => {
    setChooseColumns(config)
  }

  const screenClickEvent = (params: any) => {
    setSearchParams({ ...params, keyWord, statisticalCategory })
    searchByParams({ ...params, engineerFavoritesId: selectedFavId, keyWord, statisticalCategory })
  }

  //待处理slot tips
  const processedSlot = () => {
    return (
      <Tooltip title="需要您安排和结项的项目" placement="right">
        <QuestionCircleOutlined style={{ paddingLeft: 8, fontSize: 14 }} />
      </Tooltip>
    )
  }

  //进行中 slot
  const progressSlot = () => {
    return (
      <Tooltip title="您是项目的执行身份且未结项的项目" placement="right">
        <QuestionCircleOutlined style={{ paddingLeft: 8, fontSize: 14 }} />
      </Tooltip>
    )
  }

  console.log(currentClickTab, '111')

  return (
    <>
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
              onClick={() => setCurrentClickTab('2')}
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
                  <TabPane tab="我的项目" key="mypro" style={{ height: 'calc(100vh - 272px)' }}>
                    <MyProject />
                  </TabPane>
                </Tabs>
              </div>
            )}
            {currentClickTab === '2' && (
              <div className={styles.projectApprovalList}>
                <Tabs>
                  <TabPane tab="立项待审批" key="awaitApproval">
                    111
                  </TabPane>
                  <TabPane tab="立项审批中" key="inApproval">
                    111
                  </TabPane>
                </Tabs>
              </div>
            )}
            {currentClickTab === '3' && (
              <div className={styles.taskArrangeList}>
                <Tabs>
                  <TabPane tab="待安排" key="toArrange">
                    111
                  </TabPane>
                  <TabPane tab="待安排评审" key="toReview">
                    111
                  </TabPane>
                  <TabPane tab="公司待办" key="todo" style={{ height: 'calc(100vh - 272px)' }}>
                    <ProjectEntrust />
                  </TabPane>
                </Tabs>
              </div>
            )}
            {currentClickTab === '4' && (
              <div className={styles.reviewManageList}>
                <Tabs>
                  <TabPane tab="外审中" key="outAudit">
                    222
                  </TabPane>
                </Tabs>
              </div>
            )}
            {currentClickTab === '5' && (
              <div className={styles.finishProjectList}>
                <Tabs>
                  <TabPane tab="待结项" key="awaitFinish">
                    222
                  </TabPane>
                  <TabPane tab="结项审批" key="finishApproval">
                    222
                  </TabPane>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </PageCommonWrap>
    </>
  )
}

export default React.memo(AllProject)
