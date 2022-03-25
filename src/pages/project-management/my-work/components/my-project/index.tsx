import CommonTitle from '@/components/common-title'
import TableExportButton from '@/components/table-export-button'
import AddEngineerModal from '@/pages/project-management/all-project/components/add-engineer-modal'
import AddFavoriteModal from '@/pages/project-management/all-project/components/add-favorite-modal'
import ApproveModal from '@/pages/project-management/all-project/components/approve-modal'
import ArrangeModal from '@/pages/project-management/all-project/components/arrange-modal'
import AuditKnotModal from '@/pages/project-management/all-project/components/audit-knot-modal'
import EditArrangeModal from '@/pages/project-management/all-project/components/edit-arrange-modal'
import ExternalArrangeModal from '@/pages/project-management/all-project/components/external-arrange-modal'
import ExternalListModal from '@/pages/project-management/all-project/components/external-list-modal'
import ProjectRecallModal from '@/pages/project-management/all-project/components/project-recall-modal'
// import ProjectRemovalModal from '@/pages/project-management/all-project/components/project-removal-modal'
import ReportApproveModal from '@/pages/project-management/all-project/components/report-approve-modal'
import ShareModal from '@/pages/project-management/all-project/components/share-modal'
import UploadAddProjectModal from '@/pages/project-management/all-project/components/upload-batch-modal'
import {
  applyKnot,
  canEditArrange,
  checkCanArrange,
  deleteProject,
  getProjectInfo,
  receiveProject,
  revokeAllot,
} from '@/services/project-management/all-project'
import { removeCollectionEngineers } from '@/services/project-management/favorite-list'
import { useGetButtonJurisdictionArray, useGetUserInfo } from '@/utils/hooks'
import { DeleteOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu, message, Modal, Tooltip } from 'antd'
import { uniq } from 'lodash'
import React, { useMemo, useRef, useState } from 'react'
import { useMyWorkStore } from '../../context'
import EngineerTableWrapper from '../engineer-table-wrapper'
import TypeElement from '../type-element'
import styles from './index.less'

const MyProject: React.FC = () => {
  const [searchParams, setSearchParams] = useState({})
  const [tableSelectKeys, setTableSelectKeys] = useState<string[]>([])
  const [tableSelectRowData, setTableSelectRowData] = useState<any[]>([])

  const buttonJurisdictionArray = useGetButtonJurisdictionArray()
  // 立项
  const [addEngineerModalVisible, setAddEngineerModalVisible] = useState(false)
  // 批量立项
  const [batchAddEngineerModalVisible, setBatchAddEngineerModalVisible] = useState(false)
  // 安排
  const [arrangeModalVisible, setArrangeModalVisible] = useState(false)
  // 安排的时候需要用到
  const [currentArrangeProjectType, setCurrentArrangeProjectType] = useState<string>('2')
  const [currentArrangeProjectIsArrange, setCurrentArrangeProjectIsArrange] = useState<string>('')
  const [selectProjectIds, setSelectProjectIds] = useState<string[]>([])
  const [dataSourceType, setDataSourceType] = useState<number>()

  const [editArrangeModalVisible, setEditArrangeModalVisible] = useState<boolean>(false)
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false)
  const [recallModalVisible, setRecallModalVisible] = useState(false)
  // 撤回共享的时候用到
  const [currentRecallProjectId, setCurrentRecallProjectId] = useState<string>('')
  // 编辑安排的时候需要用到的数据
  const [editCurrentAllotCompanyId, setEditCurrentAllotCompanyId] = useState<string>('')
  const [projectAuditKnotModal, setProjectAuditKnotModal] = useState<boolean>(false)

  const [reportApproveVisible, setReportApproveVisible] = useState<boolean>(false)
  //立项审批
  const [approvingModalVisible, setApprovingModalVisible] = useState<boolean>(false)
  const [ifCanEdit, setIfCanEdit] = useState<any>([])

  //外审
  const [externalArrangeModalVisible, setExternalArrangeModalVisible] = useState<boolean>(false)
  const [externalListModalVisible, setExternalListModalVisible] = useState<boolean>(false)

  //项目迁移弹窗
  // const [removalModalVisible, setRemovalModalVisible] = useState<boolean>(false)

  const { userType = '' } = useGetUserInfo()

  const {
    currentClickTabType,
    myWorkInitData,
    currentClickTabChildActiveType,
    sideVisible,
    selectedFavId,
    favName,
  } = useMyWorkStore()

  //添加收藏夹modal
  const [addFavoriteModal, setAddFavoriteModal] = useState<boolean>(false)
  // const [favName, setFavName] = useState<string>('')

  const tableRef = useRef<HTMLDivElement>(null)

  const addEngineerEvent = () => {
    setAddEngineerModalVisible(true)
  }

  const batchAddEngineerEvent = () => {
    setBatchAddEngineerModalVisible(true)
  }

  const canDelete = useMemo(() => {
    return tableSelectRowData.filter(
      (item) =>
        item.stateInfo && (item.stateInfo.inheritStatus === 1 || item.stateInfo.inheritStatus === 3)
    )
  }, [JSON.stringify(tableSelectRowData)])

  const titleTypeArray = useMemo(() => {
    return myWorkInitData.find((item) => item.id === currentClickTabType)?.children
  }, [JSON.stringify(myWorkInitData), currentClickTabType])

  const searchEvent = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.search()
    }
  }

  const searchByParams = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.searchByParams()
    }
  }

  const engineerIds = useMemo(() => {
    return uniq(tableSelectRowData.map((item) => item.engineerId))
  }, [JSON.stringify(tableSelectRowData)])

  const refresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.refresh()
    }
  }

  const delayRefresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.delayRefresh()
    }
  }

  const addEngineerMenu = (
    <Menu>
      {buttonJurisdictionArray?.includes('all-project-project-approval') && (
        <Menu.Item key="singleAdd" onClick={() => addEngineerEvent()}>
          立项
        </Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('all-project-batch-project') && (
        <Menu.Item key="batchAdd" onClick={() => batchAddEngineerEvent()}>
          批量立项
        </Menu.Item>
      )}
    </Menu>
  )

  const arrangeMenu = (
    <Menu>
      {/* {buttonJurisdictionArray?.includes('all-project-arrange-project') && (
        <Menu.Item key="arrange" onClick={() => arrangeEvent()}>
          安排
        </Menu.Item>
      )} */}
      {buttonJurisdictionArray?.includes('all-project-edit-arrange') && (
        <Menu.Item key="editArrange" onClick={() => editArrangeEvent()}>
          修改安排
        </Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('all-project-recall-project') && (
        <Menu.Item key="revokeArrange" onClick={() => revokeAllotEvent()}>
          撤回安排
        </Menu.Item>
      )}
    </Menu>
  )

  const deleteConfirm = () => {
    if (tableSelectRowData && tableSelectRowData.length === 0) {
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
    const projectIds = tableSelectKeys
    await deleteProject(projectIds as string[])
    message.success('删除成功')
    // search();
    delayRefresh()
  }

  const arrangeEvent = async () => {
    // setArrangeModalVisible(true);
    const projectIds = tableSelectKeys
    if (projectIds.length === 0) {
      message.info('请至少选择一个项目')
      return
    }

    await checkCanArrange(projectIds as string[])

    // 如果只有一个项目需要安排的时候，需要去检查他是不是被安排了部组
    if (projectIds.length === 1) {
      const thisProjectId = projectIds[0]
      const projectInfo = await getProjectInfo(thisProjectId as string)

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
      const typeArray = tableSelectRowData.map((item) => item.dataSourceType)
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
    const projectIds = tableSelectKeys

    if (projectIds.length === 1) {
      const thisProjectId = projectIds[0]
      const projectInfo = await getProjectInfo(thisProjectId)
      setDataSourceType(Number(projectInfo.dataSourceType))
    }

    if (projectIds && projectIds.length === 0) {
      message.error('请选择修改安排的项目！')
      return
    }
    // 判断勾选的数组中是否含有状态为7的
    const statusArray = tableSelectRowData.map((item) => item.stateInfo.status)
    if (statusArray.includes(7)) {
      message.error('当前处于设计完成，不可修改安排！')
      return
    }

    const resData = await canEditArrange(projectIds)

    const { allotCompanyGroup = '' } = resData

    setIfCanEdit(resData)
    const typeArray = tableSelectRowData.map((item) => item.dataSourceType)
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
    const projectIds = tableSelectKeys

    if (projectIds.length === 0) {
      message.info('请至少选择一个项目')
      return
    }
    await revokeAllot(projectIds as string[])
    message.success('撤回安排成功')
    refresh()
  }

  const shareEvent = async () => {
    const projectIds = tableSelectKeys
    if (projectIds.length === 0) {
      message.error('请至少选择一个项目')
      return
    }

    setSelectProjectIds(projectIds)
    setShareModalVisible(true)
  }

  const recallShareEvent = async () => {
    const projectIds = tableSelectKeys
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

  const shareMenu = (
    <Menu>
      {buttonJurisdictionArray?.includes('all-project-shared') && (
        <Menu.Item key="share" onClick={() => shareEvent()}>
          共享
        </Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('all-project-share-recall') && (
        <Menu.Item key="recallShare" onClick={() => recallShareEvent()}>
          撤回共享
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
  const removeConfirm = () => {
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
  const removeFavEvent = async () => {
    await removeCollectionEngineers({ id: selectedFavId, engineerIds: engineerIds })
    message.success('已移出当前收藏夹')
    searchByParams()
  }

  // const postProjectMenu = (
  //   <Menu>
  //     {buttonJurisdictionArray?.includes('all-project-apply-knot') && (
  //       <Menu.Item key="apply" onClick={() => applyConfirm()}>
  //         申请结项
  //       </Menu.Item>
  //     )}
  //     {buttonJurisdictionArray?.includes('all-project-recall-apply-knot') && (
  //       <Menu.Item key="revoke" onClick={() => revokeConfirm()}>
  //         撤回结项
  //       </Menu.Item>
  //     )}
  //     {buttonJurisdictionArray?.includes('all-project-kont-approve') && (
  //       <Menu.Item key="audit" onClick={() => auditKnotEvent()}>
  //         结项审批
  //       </Menu.Item>
  //     )}
  //   </Menu>
  // )

  const auditKnotEvent = async () => {
    if (tableSelectKeys && tableSelectKeys.length === 0) {
      message.info('请至少选择一条数据')
      return
    }
    const projectIds = tableSelectKeys
    setSelectProjectIds(projectIds)
    setProjectAuditKnotModal(true)
  }

  const applyConfirm = () => {
    if (tableSelectKeys && tableSelectKeys.length === 0) {
      message.info('请至少选择一个项目')
      return
    }
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定对该项目进行“申请结项”?',
      okText: '确认',
      cancelText: '取消',
      onOk: applyKnotEvent,
    })
  }

  const applyKnotEvent = async () => {
    const projectIds = tableSelectKeys
    await applyKnot(projectIds)
    message.success('申请结项成功')
    delayRefresh()
  }

  // const revokeConfirm = () => {
  //   if (tableSelectKeys && tableSelectKeys.length === 0) {
  //     message.error('请至少选择一个项目')
  //     return
  //   }
  //   Modal.confirm({
  //     title: '提示',
  //     icon: <ExclamationCircleOutlined />,
  //     content: '确定撤回结项吗？',
  //     okText: '确认',
  //     cancelText: '取消',
  //     onOk: revokeKnotEvent,
  //   })
  // }

  // const revokeKnotEvent = async () => {
  //   const projectIds = tableSelectKeys
  //   await revokeKnot(projectIds)
  //   message.success('撤回结项成功')
  //   refresh()
  // }

  // 外审安排
  const externalArrange = () => {
    if (tableSelectKeys && tableSelectKeys.length === 0) {
      message.info('请选择要操作的项目')
      return
    }
    setExternalArrangeModalVisible(true)
  }

  const batchButtonElement = () => {
    return currentClickTabChildActiveType === 'awaitApprove' &&
      buttonJurisdictionArray?.includes('all-project-report-project') ? (
      <Button type="primary" onClick={() => reportApprove(tableSelectKeys)}>
        报审
      </Button>
    ) : currentClickTabChildActiveType === 'approveing' &&
      buttonJurisdictionArray?.includes('all-project-approve-project') ? (
      <Button type="primary" onClick={() => approveProjectEvent(tableSelectKeys)}>
        审批
      </Button>
    ) : currentClickTabChildActiveType === 'awaitAllot' &&
      buttonJurisdictionArray?.includes('all-project-arrange-project') ? (
      <Button type="primary" onClick={() => arrangeEvent()}>
        安排
      </Button>
    ) : currentClickTabChildActiveType === 'waitArrangAudit' &&
      buttonJurisdictionArray?.includes('all-project-external-audit') ? (
      <Button type="primary" onClick={() => externalArrange()}>
        安排外审
      </Button>
    ) : currentClickTabChildActiveType === 'agent' ? (
      buttonJurisdictionArray?.includes('get-project-entrust') &&
      userType === 2 && (
        <Button type="primary" onClick={() => receiveProjectEvent()}>
          获取
        </Button>
      )
    ) : currentClickTabChildActiveType === 'externalReviewing' ? (
      buttonJurisdictionArray?.includes('review-manage') && (
        <Button type="primary" onClick={() => externalEdit()}>
          评审管理
        </Button>
      )
    ) : currentClickTabChildActiveType === 'awaitApplyKnot' ? (
      buttonJurisdictionArray?.includes('all-project-apply-knot') && (
        <Button type="primary" onClick={() => applyConfirm()}>
          结项申请
        </Button>
      )
    ) : currentClickTabChildActiveType === 'approveKnot' ? (
      buttonJurisdictionArray?.includes('all-project-kont-approve') && (
        <Button type="primary" onClick={() => auditKnotEvent()}>
          结项审批
        </Button>
      )
    ) : sideVisible && selectedFavId ? (
      buttonJurisdictionArray?.includes('remove-favorite-project') && (
        <Button type="primary" onClick={() => removeConfirm()}>
          移出收藏夹
        </Button>
      )
    ) : null
  }

  const externalEdit = async () => {
    if (tableSelectKeys && tableSelectKeys.length === 1) {
      setExternalListModalVisible(true)
      return
    }
    message.warning('请选择单条数据查看评审')
  }

  //立项待审批模态框
  const reportApprove = (projectId: string[]) => {
    if (projectId && projectId.length > 0) {
      setReportApproveVisible(true)
      return
    }
    message.info('请选择需要报审的项目')
  }

  //立项审批
  const approveProjectEvent = (projectId: string[]) => {
    if (projectId && projectId.length > 0) {
      setApprovingModalVisible(true)
      return
    }
    message.info('请选择需要审批的项目')
  }

  //项目获取
  const receiveProjectEvent = async () => {
    if (tableSelectKeys && tableSelectKeys.length === 0) {
      message.info('请选择您要获取的待办项目')
      return
    }
    Modal.confirm({
      title: '获取待办项目',
      icon: <ExclamationCircleOutlined />,
      content: `确认将选中的项目获取至当前账号的项目列表？`,
      okText: '确认',
      cancelText: '取消',
      onOk: sureReceiveProject,
    })
  }

  const sureReceiveProject = async () => {
    await receiveProject(tableSelectKeys)
    message.success('项目获取成功')
    delayRefresh()
  }

  //项目迁移
  // const removalEvent = () => {
  //   setRemovalModalVisible(true)
  // }

  return (
    <div className={styles.myProjectContent}>
      <div className={styles.myProjectCommonContent}>
        <div className={styles.myProjectCommonLeft}>
          {favName ? (
            <CommonTitle>{favName}</CommonTitle>
          ) : (
            <TypeElement typeArray={titleTypeArray} />
          )}
        </div>
        {currentClickTabChildActiveType !== 'agent' &&
          currentClickTabChildActiveType !== 'approveing' && (
            <div className={styles.myProjectCommonRight}>
              {(buttonJurisdictionArray?.includes('all-project-project-approval') ||
                buttonJurisdictionArray?.includes('all-project-batch-project')) && (
                <Dropdown overlay={addEngineerMenu}>
                  <Button className="mr7" type="primary">
                    立项 <DownOutlined />
                  </Button>
                </Dropdown>
              )}

              {(buttonJurisdictionArray?.includes('all-project-arrange-project') ||
                buttonJurisdictionArray?.includes('all-project-edit-arrange') ||
                buttonJurisdictionArray?.includes('all-project-recall-project')) && (
                <Dropdown overlay={arrangeMenu}>
                  <Button className="mr7">
                    修改安排 <DownOutlined />
                  </Button>
                </Dropdown>
              )}
              {buttonJurisdictionArray?.includes('all-project-delete-project') && (
                <>
                  {canDelete.length > 0 && (
                    <Tooltip title="您勾选的项目中含有继承中的项目，不能进行删除操作">
                      <Button disabled={true} className="mr7">
                        <DeleteOutlined />
                        删除
                      </Button>
                    </Tooltip>
                  )}
                  {canDelete.length === 0 && (
                    <Button className="mr7" onClick={() => deleteConfirm()}>
                      <DeleteOutlined />
                      删除
                    </Button>
                  )}
                </>
              )}
              {(buttonJurisdictionArray?.includes('all-project-shared') ||
                buttonJurisdictionArray?.includes('all-project-share-recall')) && (
                <Dropdown overlay={shareMenu}>
                  <Button className="mr7">
                    共享 <DownOutlined />
                  </Button>
                </Dropdown>
              )}
              {buttonJurisdictionArray?.includes('add-favorite-project') && !sideVisible && (
                <Button className="mr7" onClick={() => addFavEvent()}>
                  收藏
                </Button>
              )}
              {(buttonJurisdictionArray?.includes('all-project-export-all') ||
                buttonJurisdictionArray?.includes('all-project-export-selected')) &&
                currentClickTabType === 'allpro' &&
                !sideVisible && (
                  <div className="mr7">
                    <TableExportButton
                      exportUrl="/Porject/Export"
                      selectIds={tableSelectKeys as string[]}
                      extraParams={{
                        ...searchParams,
                      }}
                    />
                  </div>
                )}
              {/* {buttonJurisdictionArray?.includes('add-favorite-project') && !sideVisible && ( */}
              {/* <Button className="mr7" onClick={() => removalEvent()}>
                项目迁移
              </Button> */}
              {/* // )} */}
            </div>
          )}
      </div>

      <div className={styles.myProjectTableContent}>
        <EngineerTableWrapper
          ref={tableRef}
          batchButtonSlot={batchButtonElement}
          getSelectRowData={(data) => setTableSelectRowData(data)}
          getSelectRowKeys={(data) => setTableSelectKeys(data as string[])}
          getSearchParams={(params) => setSearchParams(params)}
        />
      </div>

      {addEngineerModalVisible && (
        <AddEngineerModal
          finishEvent={delayRefresh}
          visible={addEngineerModalVisible}
          onChange={setAddEngineerModalVisible}
        />
      )}
      <UploadAddProjectModal
        visible={batchAddEngineerModalVisible}
        onChange={setBatchAddEngineerModalVisible}
        refreshEvent={searchEvent}
      />
      {editArrangeModalVisible && (
        <EditArrangeModal
          allotCompanyId={editCurrentAllotCompanyId}
          changeFinishEvent={refresh}
          visible={editArrangeModalVisible}
          onChange={setEditArrangeModalVisible}
          projectIds={selectProjectIds}
          canEdit={ifCanEdit}
          dataSourceType={dataSourceType}
        />
      )}
      {projectAuditKnotModal && (
        <AuditKnotModal
          visible={projectAuditKnotModal}
          onChange={setProjectAuditKnotModal}
          projectIds={selectProjectIds}
          finishEvent={delayRefresh}
        />
      )}

      {arrangeModalVisible && (
        <ArrangeModal
          finishEvent={delayRefresh}
          visible={arrangeModalVisible}
          onChange={setArrangeModalVisible}
          defaultSelectType={currentArrangeProjectType}
          allotCompanyId={currentArrangeProjectIsArrange}
          projectIds={selectProjectIds}
          dataSourceType={dataSourceType}
          setSourceTypeEvent={setDataSourceType}
        />
      )}
      {shareModalVisible && (
        <ShareModal
          finishEvent={refresh}
          visible={shareModalVisible}
          onChange={setShareModalVisible}
          projectIds={selectProjectIds}
        />
      )}
      {recallModalVisible && (
        <ProjectRecallModal
          changeFinishEvent={refresh}
          visible={recallModalVisible}
          projectId={currentRecallProjectId}
          onChange={setRecallModalVisible}
        />
      )}
      {reportApproveVisible && (
        <ReportApproveModal
          visible={reportApproveVisible}
          onChange={setReportApproveVisible}
          finishEvent={delayRefresh}
          projectIds={tableSelectKeys}
        />
      )}
      {approvingModalVisible && (
        <ApproveModal
          visible={approvingModalVisible}
          onChange={setApprovingModalVisible}
          finishEvent={delayRefresh}
          projectIds={tableSelectKeys}
        />
      )}
      {addFavoriteModal && (
        <AddFavoriteModal
          visible={addFavoriteModal}
          onChange={setAddFavoriteModal}
          finishEvent={refresh}
          engineerIds={engineerIds}
        />
      )}
      {externalArrangeModalVisible && (
        <ExternalArrangeModal
          projectId={tableSelectKeys}
          onChange={setExternalArrangeModalVisible}
          visible={externalArrangeModalVisible}
          search={delayRefresh}
        />
      )}
      {externalListModalVisible && (
        <ExternalListModal
          projectId={tableSelectKeys[0]}
          visible={externalListModalVisible}
          onChange={setExternalListModalVisible}
          refresh={delayRefresh}
        />
      )}
      {/* {removalModalVisible && (
        <ProjectRemovalModal
          visible={removalModalVisible}
          finishEvent={delayRefresh}
          onChange={setRemovalModalVisible}
          projectId={tableSelectKeys}
        />
      )} */}
    </div>
  )
}

export default MyProject
