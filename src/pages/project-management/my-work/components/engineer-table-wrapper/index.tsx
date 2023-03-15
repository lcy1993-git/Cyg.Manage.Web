import CyTag from '@/components/cy-tag'
import ImageIcon from '@/components/image-icon'
import TableSearch from '@/components/table-search'
// import { useLayoutStore } from '@/layouts/context'
import AddProjectModal from '@/pages/project-management/all-project/components/add-project-modal'
import ApprovalProjectModal from '@/pages/project-management/all-project/components/approval-project-modal'
import ApproveModal from '@/pages/project-management/all-project/components/approve-modal'
import ArrangeModal from '@/pages/project-management/all-project/components/arrange-modal'
import AuditKnotModal from '@/pages/project-management/all-project/components/audit-knot-modal'
import ColumnsConfigModal from '@/pages/project-management/all-project/components/columns-config-modal'
import CopyProjectModal from '@/pages/project-management/all-project/components/copy-project-modal'
import EditEnigneerModal from '@/pages/project-management/all-project/components/edit-engineer-modal'
import EditProjectModal from '@/pages/project-management/all-project/components/edit-project-modal'
import EngineerDetailInfo from '@/pages/project-management/all-project/components/engineer-detail-info'
import ExternalArrangeModal from '@/pages/project-management/all-project/components/external-arrange-modal'
import ExternalListModal from '@/pages/project-management/all-project/components/external-list-modal'
import ProjectDetailInfo from '@/pages/project-management/all-project/components/project-detail-info'
import ProjectInheritModal from '@/pages/project-management/all-project/components/project-inherit-modal'
import ProjectMergeModal from '@/pages/project-management/all-project/components/project-merge-modal/idnex'
import ReportApproveModal from '@/pages/project-management/all-project/components/report-approve-modal'
import ScreenModal from '@/pages/project-management/all-project/components/screen-modal'
import FilterEntrustModal from '@/pages/project-management/project-entrust/components/filter-entrust-modal'
import {
  againInherit,
  applyKnot,
  deleteProject,
  getColumnsConfig,
  getProjectInfo,
  modifyExportPowerState,
} from '@/services/project-management/all-project'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import {
  BarsOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
  MessageOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Divider, Dropdown, Input, Menu, message, Modal, Popconfirm, Tooltip } from 'antd'
import moment from 'moment'
import uuid from 'node-uuid'
import React, {
  forwardRef,
  Key,
  Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
// import { history } from 'umi'
import { useMyWorkStore } from '../../context'
import ArchiveModal from '../archive-modal'
import EngineerTable from '../engineer-table'
import styles from './index.less'

const { Search } = Input

const colorMap = {
  立项: 'green',
  委托: 'blue',
  共享: 'yellow',
  执行: 'yellow',
}

interface JurisdictionInfo {
  canEdit: boolean
  canCopy: boolean
  canInherit: boolean
}

interface EngineerTableWrapperProps {
  // TODO
  getSelectRowKeys?: (selectKeys: Key[]) => void
  // TODO
  getSelectRowData?: (selectRowData: any[]) => void
  // TODO
  getSearchParams?: (searchParams: any) => void

  batchButtonSlot?: () => React.ReactNode
}
export const initSearchParams = {
  category: [],
  stage: [],
  constructType: [],
  nature: [],
  kvLevel: [],
  status: [],
  majorCategory: [],
  pType: [],
  plannedYear: undefined,
  childrenIds: [],
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
  costUser: '',
  statisticalCategory: '-1',
}
const EngineerTableWrapper = (props: EngineerTableWrapperProps, ref: Ref<any>) => {
  const { getSelectRowKeys, getSelectRowData, batchButtonSlot } = props
  const [keyWord, setKeyWord] = useState<string>('')
  // 从列表返回的数据中获取 TODO设置search的参数
  const [searchParams, setSearchParams] = useState(initSearchParams)
  const [modalNeedInfo, setModalInfo] = useState<any>({
    engineerId: '',
    projectId: '',
    areaId: '',
    company: '',
    companyName: '',
  })
  const [externalStepData] = useState<any>()
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()

  // 工程详情
  const [engineerModalVisible, setEngineerModalVisible] = useState(false)
  // 新增项目
  const [addProjectVisible, setAddProjectVisible] = useState(false)
  // 编辑工程信息
  const [editEngineerVisible, setEditEngineerVisible] = useState<boolean>(false)
  // 批复文件上传
  const [approvalEngineerVisible, setApprovalEngineerVisible] = useState<boolean>(false)
  // 查看项目详情
  const [projectModalVisible, setProjectModalVisible] = useState<boolean>(false)
  // 安排项目
  const [arrangeModalVisible, setArrangeModalVisible] = useState<boolean>(false)
  //
  const [auditKnotModalVisible, setAuditKnotModalVisible] = useState<boolean>(false)
  // 外审安排
  const [externalArrangeModalVisible, setExternalArrangeModalVisible] = useState<boolean>(false)
  // 外审列表
  const [externalListModalVisible, setExternalListModalVisible] = useState<boolean>(false)
  // 编辑项目
  const [editProjectVisible, setEditProjectVisible] = useState<boolean>(false)
  // 项目继承状态判断
  const [inheritState, setInheritState] = useState<boolean>(false)
  // 复制项目
  const [copyProjectVisible, setCopyProjectVisible] = useState<boolean>(false)
  // 项目继承
  const [projectInheritVisible, setProjectInheritVisible] = useState<boolean>(false)
  //立项待审批
  const [reportApproveVisible, setReportApproveVisible] = useState<boolean>(false)
  //立项审批
  const [approvingModalVisible, setApprovingModalVisible] = useState<boolean>(false)
  // 筛选
  const [screenModalVisible, setScreenModalVisible] = useState(false)
  //公司待办筛选
  const [filterAgentModalVisible, setFilterAgentModalVisible] = useState(false)
  // 列设置
  const [chooseColumnsModal, setChooseColumnsModal] = useState<boolean>(false)

  const [chooseColumns, setChooseColumns] = useState<string[]>([])
  //项目合并模态框
  const [projectMergeVisible, setProjectMergeVisible] = useState<boolean>(false)

  //项目归档模态框
  const [archiveVisible, setArchiveVisible] = useState<boolean>(false)
  // 预设计
  // const { setPreDesignItem } = useLayoutStore()

  //获取用户身份
  // @ts-ignore
  const { userType } = JSON.parse(localStorage.getItem('userInfo'))
  const tableRef = useRef<HTMLDivElement>(null)
  const {
    currentClickTabChildActiveType,
    myWorkInitData,
    indexToPageSearchParams,
    currentClickTabType,
    selectedFavId,
    refreshStatistics,
  } = useMyWorkStore()

  const typeColumns = useMemo(() => {
    return myWorkInitData
      .find((item) => item.id === currentClickTabType)
      ?.children.find((item: any) => item.id === currentClickTabChildActiveType).typeColumns
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(myWorkInitData), currentClickTabChildActiveType, currentClickTabType])

  const { data: columnsData } = useRequest(() => getColumnsConfig(), {
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

  const projectNameClickEvent = (engineerId: string) => {
    setModalInfo({
      engineerId,
    })
    setEngineerModalVisible(true)
  }

  const addProjectEvent = (record: any) => {
    setModalInfo({
      engineerId: record.id,
      areaId: record.province,
      company: record.company,
      companyName: record.company,
    })
    setAddProjectVisible(true)
  }

  const editEngineerEvent = (record: any) => {
    const minStartTime = Math.min(
      ...record.projects.map((item: any) => {
        return item.startTime
      })
    )
    const maxEndTime = Math.max(
      ...record.projects.map((item: any) => {
        return item.endTime
      })
    )
    setModalInfo({
      engineerId: record.id,
      areaId: record.province,
      company: record.company,
      companyName: record.company,
      minStartTime,
      maxEndTime,
    })
    setEditEngineerVisible(true)
  }

  const editProjectEvent = (info: any) => {
    if (info.inheritState === 2) {
      setInheritState(true)
    }
    setModalInfo({
      ...info,
    })
    setEditProjectVisible(true)
  }

  const copyProjectEvent = (info: any) => {
    setModalInfo({
      ...info,
    })
    setCopyProjectVisible(true)
  }

  const projectInherit = (projectInfo: any) => {
    setModalInfo({
      ...projectInfo,
    })
    setProjectInheritVisible(true)
  }
  /**归档 */
  const archiveGrid = (projectInfo: any) => {
    setModalInfo({
      ...projectInfo,
    })
    setArchiveVisible(true)
  }

  const projectItemMenu = (
    jurisdictionInfo: JurisdictionInfo,
    tableItemData: any,
    engineerInfo: any,
    status: any
  ) => {
    const { stateInfo } = tableItemData

    return (
      <Menu>
        {jurisdictionInfo.canEdit && buttonJurisdictionArray?.includes('all-project-edit-project') && (
          <Menu.Item
            key="editProject"
            onClick={() => {
              editProjectEvent({
                projectId: tableItemData.id,
                areaId: engineerInfo.province,
                libId: engineerInfo.libId,
                company: engineerInfo.company,
                companyName: engineerInfo.company,
                startTime: engineerInfo.startTime,
                endTime: engineerInfo.endTime,
                status: tableItemData.stateInfo.status,
                inheritState: tableItemData.stateInfo.inheritStatus,
              })
            }}
          >
            编辑
          </Menu.Item>
        )}
        {jurisdictionInfo.canCopy && buttonJurisdictionArray?.includes('all-project-copy-project') && (
          <Menu.Item
            key="copyProject"
            onClick={() =>
              copyProjectEvent({
                projectId: tableItemData.id,
                areaId: engineerInfo.province,
                company: engineerInfo.company,
                engineerId: engineerInfo.id,
                companyName: engineerInfo.company,
                startTime: engineerInfo.startTime,
                endTime: engineerInfo.endTime,
                status: status,
              })
            }
          >
            复制项目
          </Menu.Item>
        )}
        {jurisdictionInfo.canInherit && buttonJurisdictionArray?.includes('all-project-inherit') && (
          // all-project-inherit
          <Menu.Item
            key="projectInherit"
            onClick={() =>
              projectInherit({
                projectId: tableItemData.id,
                areaId: engineerInfo.province,
                company: engineerInfo.company,
                engineerId: engineerInfo.id,
                companyName: engineerInfo.company,
                startTime: engineerInfo.startTime,
                endTime: engineerInfo.endTime,
              })
            }
          >
            项目继承
          </Menu.Item>
        )}
        {stateInfo.status === 7 && (
          <Menu.Item
            onClick={() =>
              archiveGrid({
                projectId: tableItemData.id,
              })
            }
          >
            网架归档
          </Menu.Item>
        )}
        {tableItemData.identitys.findIndex((item: any) => item.value === 4) > -1 &&
          status !== 30 &&
          status !== 31 &&
          buttonJurisdictionArray?.includes('all-project-merge') && (
            <Menu.Item onClick={() => projectMergeEvent(tableItemData.id)}>项目合并</Menu.Item>
          )}
        {buttonJurisdictionArray?.includes('all-project-submitToQGC') && (
          <Menu.Item onClick={() => projectMergeEvent(tableItemData.id)}>提交项目</Menu.Item>
        )}
      </Menu>
    )
  }

  const projectMergeEvent = (projectId: string) => {
    setModalInfo({
      projectId: projectId,
    })
    setProjectMergeVisible(true)
  }
  const submitProjectToQGC = (projectId: string) => {
    console.log('tijiao')
  }

  const checkProjectDetail = (projectId: string, judgmentMark: boolean) => {
    setModalInfo({
      projectId,
      judgmentMark,
    })
    setProjectModalVisible(true)
  }

  const projectNameRender = (record: any) => {
    // 代表未继承

    if (!record.stateInfo.inheritStatus) {
      return (
        <>
          <u
            className="canClick"
            onClick={() => checkProjectDetail(record.id, record.judgmentMark)}
          >
            {/* <span className={styles.unread}></span> */}
            {record.sources?.includes('被委托') &&
              record.identitys.findIndex((item: any) => item.value === 4) > -1 &&
              record.stateInfo.status === 14 &&
              record.judgmentMark.showEntrustTip && (
                <Tooltip title="未处理">
                  <MessageOutlined style={{ color: 'red', marginRight: '5px' }} />
                </Tooltip>
              )}

            {record.name}
          </u>
        </>
      )
    }
    if (record.stateInfo.inheritStatus) {
      if (record.stateInfo.inheritStatus === 1) {
        return <span className={styles.disabled}>[继承中...]{record.name}</span>
      }
      if (record.stateInfo.inheritStatus === 2) {
        return (
          <u
            className="canClick"
            onClick={() => checkProjectDetail(record.id, record.judgmentMark)}
          >
            {record.name}
          </u>
        )
      }
      if (record.stateInfo.inheritStatus === 3) {
        return <span className={styles.disabled}>{record.name}</span>
      }
    }
    return
  }

  // 重新继承
  const againInheritEvent = async (projectId: string) => {
    await againInherit(projectId)
    message.success('重新继承申请成功')

    refreshEvent()
  }

  // 取消继承
  const deleteFailProject = async (projectId: string) => {
    await deleteProject([projectId])
    message.success('已取消项目继承')
    refreshEvent()
  }

  const modifyExportPowerStateEvent = async (isEnable: boolean, projectIds: string[]) => {
    await modifyExportPowerState({ isEnable, projectIds })
    refreshEvent()
  }

  const projectNameCompleteRender = (value: string, record: any) => {
    // const projects = record.engineerInfo.projects
    // const parentData = projects.filter((item: any) => item.id === record.inheritId)

    if (record.stateInfo.inheritStatus) {
      if (record.stateInfo.inheritStatus === 3) {
        return (
          <>
            {record.sources?.includes('被委托') &&
              record.identitys.findIndex((item: any) => item.value === 4) > -1 &&
              record.stateInfo.status === 14 &&
              record.judgmentMark.showEntrustTip && (
                <Tooltip title="未处理">
                  <MessageOutlined style={{ color: 'red', marginRight: '5px' }} />
                </Tooltip>
              )}
            <Tooltip title={`继承自${record.inheritName}`}>
              <span className={styles.inheritIcon}>
                <LinkOutlined />
              </span>
            </Tooltip>
            <span>
              <Popconfirm
                title="项目继承失败，请重试"
                onConfirm={() => againInheritEvent(record.id)}
                onCancel={() => deleteFailProject(record.id)}
                okText="确认"
                cancelText="取消"
              >
                <span className={styles.dangerColor}>[继承失败]</span>
              </Popconfirm>
            </span>
            <Tooltip title={record.name}>{projectNameRender(record)}</Tooltip>
          </>
        )
      }
      return (
        <>
          <Tooltip title={`继承自${record.inheritName}`}>
            <span className={styles.inheritIcon}>
              <LinkOutlined />
            </span>
          </Tooltip>
          <Tooltip title={record.name}>{projectNameRender(record)}</Tooltip>
        </>
      )
    } else {
      return (
        <>
          <Tooltip title={record.name}>{projectNameRender(record)}</Tooltip>
        </>
      )
    }
  }
  // 安排项目
  const arrange = async (projectId: string, projectType?: number, allotCompanyId?: string) => {
    const projectInfo = await getProjectInfo(projectId)

    setModalInfo({
      projectDataSource: Number(projectInfo?.dataSourceType),
      projectId: projectId,
      projectType: projectType ? String(projectType) : undefined,
      allotCompanyId: allotCompanyId,
      allotGroupId: projectInfo.allots ? projectInfo?.allots[0]?.allotCompanyGroup : '',
    })
    setArrangeModalVisible(true)
  }

  // 申请结项
  const applyKnotEvent = async (projectId: string[]) => {
    await applyKnot(projectId)
    message.success('申请结项成功')
    delayRefresh()
  }

  const applyConfirm = (id: string[]) => {
    Modal.confirm({
      title: '申请结项',
      icon: <ExclamationCircleOutlined />,
      content: '确定对该项目进行“申请结项”?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => applyKnotEvent(id),
    })
  }

  const auditKnotEvent = (projectId: string) => {
    setModalInfo({
      projectId,
    })
    setAuditKnotModalVisible(true)
  }

  // 外审安排
  const externalArrange = async (projectId: string[]) => {
    setModalInfo({
      projectId: projectId,
    })
    setExternalArrangeModalVisible(true)
  }

  // 外审列表
  const externalEdit = async (projectId: string) => {
    setModalInfo({
      projectId,
    })
    setExternalListModalVisible(true)
  }

  //字段隐藏时展示tips
  const showNameTips = (tips: any) => {
    return <Tooltip title={tips}>{tips}</Tooltip>
  }

  const completeConfig = [
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 400, // TODO:
      render: projectNameCompleteRender,
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: '项目编码',
      dataIndex: 'code',
      width: 200,
      ellipsis: true,
      render: (text: any, record: any) => {
        return showNameTips(record.code)
      },
    },
    {
      title: '现场数据来源',
      dataIndex: 'dataSourceTypeText',
      width: 120,
      render: (text: any, record: any) => {
        return record.dataSourceType === 0 ? (
          <ImageIcon width={52} height={18} imgUrl="kc.png" />
        ) : record.dataSourceType === 1 ? (
          <ImageIcon width={52} height={18} imgUrl="dwdr.png" />
        ) : (
          <ImageIcon width={66} height={18} imgUrl="mkc.png" />
        )
      },
    },
    {
      title: '项目分类',
      dataIndex: 'categoryText',
      width: 100,
      ellipsis: true,
    },
    {
      title: '项目类型',
      dataIndex: 'pTypeText',
      width: 140,
      ellipsis: true,
    },
    {
      title: '电压等级',
      dataIndex: 'kvLevelText',
      width: 100,
      ellipsis: true,
    },
    {
      title: '项目性质',
      dataIndex: 'natureTexts',
      width: 180,
      render: (value: string, record: any) => {
        const { natureTexts = [] } = record
        return (
          <Tooltip placement="leftBottom" title={natureTexts.join('/')}>
            {natureTexts.join('/')}
          </Tooltip>
        )
      },
      ellipsis: true,
    },
    {
      title: '项目起止时间',
      dataIndex: 'projectTime',
      width: 190,
      ellipsis: true,
      render: (value: string, record: any) => {
        const { startTime, endTime } = record
        if (startTime && endTime) {
          return showNameTips(
            `${moment(startTime).format('YYYY-MM-DD')} 至 ${moment(endTime).format('YYYY-MM-DD')}`
          )
        }
        if (startTime && !endTime) {
          return showNameTips(`开始时间: ${moment(startTime).format('YYYY-MM-DD')}`)
        }
        if (!startTime && endTime) {
          return showNameTips(`截止时间: ${moment(startTime).format('YYYY-MM-DD')}`)
        }
        return '未设置起止时间'
      },
    },
    {
      title: '专业类别',
      dataIndex: 'majorCategoryText',
      width: 120,
      ellipsis: true,
    },
    {
      title: '建设改造目的',
      dataIndex: 'reformAimText',
      width: 120,
      ellipsis: true,
      render: (text: any, record: any) => {
        return showNameTips(record.reformAimText)
      },
    },
    {
      title: '所属市公司',
      dataIndex: 'cityCompany',
      width: 120,
      ellipsis: true,
      render: (text: any, record: any) => {
        return showNameTips(record.cityCompany)
      },
    },
    {
      title: '所属县公司',
      dataIndex: 'countyCompany',
      width: 120,
      ellipsis: true,
      render: (text: any, record: any) => {
        return showNameTips(record.countyCompany)
      },
    },
    {
      title: '建设类型',
      dataIndex: 'constructTypeText',
      width: 120,
      ellipsis: true,
    },
    {
      title: '项目类别',
      dataIndex: 'pCategoryText',
      width: 120,
      ellipsis: true,
      render: (text: any, record: any) => {
        return showNameTips(record.pCategoryText)
      },
    },
    {
      title: '项目阶段',
      dataIndex: 'stageText',
      width: 120,
      ellipsis: true,
    },
    {
      title: '项目属性',
      dataIndex: 'pAttributeText',
      width: 120,
      ellipsis: true,
      render: (text: any, record: any) => {
        return showNameTips(record.pAttributeText)
      },
    },
    {
      title: '交底范围',
      dataIndex: 'disclosureRange',
      width: 120,
    },
    {
      title: '桩位范围',
      dataIndex: 'pileRange',
      width: 120,
    },

    {
      title: '导出坐标权限',
      dataIndex: 'exportCoordinate',
      width: 120,
      render: (value: string, record: any) => {
        const status = record.exportCoordinate
        return (
          <>
            {buttonJurisdictionArray?.includes('all-project-coordinate') &&
              (record.exportCoordinate === true ? (
                <span
                  style={{ cursor: 'pointer' }}
                  className="colorRed"
                  onClick={() => modifyExportPowerStateEvent(!status, [record.id])}
                >
                  启用
                </span>
              ) : (
                <span
                  style={{ cursor: 'pointer' }}
                  className="colorPrimary"
                  onClick={() => modifyExportPowerStateEvent(!status, [record.id])}
                >
                  禁用
                </span>
              ))}
            {!buttonJurisdictionArray?.includes('all-project-coordinate') &&
              (record.exportCoordinate === true ? (
                <span className="colorRed">启用</span>
              ) : (
                <span className="colorPrimary">禁用</span>
              ))}
          </>
        )
      },
    },
    {
      title: '勘察人',
      dataIndex: 'surveyUser',
      width: 120,
      ellipsis: true,
      render: (value: string, record: any) => {
        return record.surveyUser
          ? `${record.surveyUser.value}`
          : record.dataSourceType === 0
          ? ''
          : '无需安排'
      },
    },
    {
      title: '设计人',
      dataIndex: 'designUser',
      width: 120,
      ellipsis: true,
      render: (value: string, record: any) => {
        return record.designUser ? `${record.designUser.value}` : ''
      },
    },
    {
      title: '项目批次',
      dataIndex: 'batchText',
      width: 120,
      ellipsis: true,
    },
    {
      title: '项目来源',
      dataIndex: 'sources',
      width: 120,
      render: (value: string, record: any) => {
        const { sources = [] } = record
        return sources?.map((item: any) => {
          return (
            <span key={uuid.v1()}>
              <CyTag color={colorMap[item] ? colorMap[item] : 'green'}>
                <span>{item}</span>
              </CyTag>
            </span>
          )
        })
      },
    },
    {
      title: '项目身份',
      dataIndex: 'identitys',
      width: 180,
      render: (value: string, record: any) => {
        const { identitys = [] } = record
        return identitys
          .filter((item: any) => item.text)
          .map((item: any) => {
            return (
              <span className="mr7" key={uuid.v1()}>
                <CyTag color={colorMap[item.text] ? colorMap[item.text] : 'green'}>
                  {item.text}
                </CyTag>
              </span>
            )
          })
      },
    },
    {
      title: '项目状态',
      width: 120,
      dataIndex: 'status',
      fixed: 'right',
      render: (value: string, record: any) => {
        const { stateInfo, allot, identitys } = record

        let arrangeType: any = null
        let allotCompanyId: any = null

        if (allot) {
          arrangeType = allot.allotType
          allotCompanyId = allot.allotCompanyGroup
        }

        // 如果是继承失败 和 继承中，直接返回状态，不用做下面的判断了。
        if (
          record.stateInfo.inheritStatus &&
          (record.stateInfo.inheritStatus === 1 || record.stateInfo.inheritStatus === 3)
        ) {
          return <span>{stateInfo?.statusText}</span>
        }

        return (
          <>
            {buttonJurisdictionArray?.includes('all-project-copy-project') && (
              <span>
                {!stateInfo.isArrange &&
                identitys.findIndex((item: any) => item.value === 4) > -1 &&
                stateInfo.status === 14 ? (
                  <span
                    className="canClick"
                    onClick={() => arrange(record.id, arrangeType, allotCompanyId)}
                  >
                    {stateInfo?.statusText}
                  </span>
                ) : identitys.findIndex((item: any) => item.value === 4) > -1 &&
                  stateInfo.status === 7 ? (
                  <span className="canClick" onClick={() => applyConfirm([record.id])}>
                    {stateInfo?.statusText}
                  </span>
                ) : identitys.findIndex((item: any) => item.value === 1) > -1 &&
                  stateInfo.status === 15 ? (
                  <span className="canClick" onClick={() => auditKnotEvent(record.id)}>
                    {stateInfo?.statusText}
                  </span>
                ) : identitys.findIndex((item: any) => item.value === 1) > -1 &&
                  stateInfo.status === 30 &&
                  userType === 2 ? (
                  <span className="canClick" onClick={() => reportApprove([record.id])}>
                    {stateInfo?.statusText}
                  </span>
                ) : identitys.findIndex((item: any) => item.value === 4) > -1 &&
                  stateInfo.status === 8 &&
                  stateInfo.outsideStatus === 95 ? (
                  <span className="canClick" onClick={() => externalArrange([record.id])}>
                    {stateInfo?.outsideStatusText}
                  </span>
                ) : identitys.findIndex((item: any) => item.value === 4) > -1 &&
                  stateInfo.status === 8 &&
                  stateInfo.outsideStatus === 100 ? (
                  <span className="canClick" onClick={() => externalEdit(record.id)}>
                    {stateInfo?.outsideStatusText}
                  </span>
                ) : identitys.findIndex((item: any) => item.value === 4) > -1 &&
                  stateInfo.status === 8 &&
                  stateInfo.outsideStatus === 105 ? (
                  <span className="canClick" onClick={() => externalEdit(record.id)}>
                    {stateInfo?.outsideStatusText}
                  </span>
                ) : (
                  <span>{stateInfo?.showStatusText}</span>
                )}
              </span>
            )}
            {!buttonJurisdictionArray?.includes('all-project-copy-project') && (
              <span>{stateInfo?.showStatusText}</span>
            )}
          </>
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 60,
      fixed: 'right',
      render: (value: string, record: any) => {
        const { operationAuthority, stateInfo } = record

        if (
          stateInfo.inheritStatus &&
          (stateInfo.inheritStatus === 1 || stateInfo.inheritStatus === 3)
        ) {
          return (
            <Tooltip title="项目继承中，不能进行任何操作" placement="topRight">
              <BarsOutlined />
            </Tooltip>
          )
        }
        return (
          <Dropdown
            overlay={() =>
              projectItemMenu(
                operationAuthority,
                record,
                record.engineerInfo,
                record.stateInfo.status
              )
            }
            placement="bottomLeft"
            arrow
          >
            <BarsOutlined />
          </Dropdown>
        )
      },
    },
  ]

  const approvalFileEvent = (record: any) => {
    setModalInfo({
      engineerId: record.id,
      areaId: record.province,
      company: record.company,
      companyName: record.company,
    })
    setApprovalEngineerVisible(true)
  }

  //立项待审批模态框
  const reportApprove = (projectId: string[]) => {
    if (projectId && projectId.length > 0) {
      setModalInfo({
        projectId: projectId,
      })
      setReportApproveVisible(true)
      return
    }
    message.info('请选择需要报审的项目')
  }

  const parentColumns: any[] = [
    {
      dataIndex: 'name',
      key: 'name',
      render: (value: string, record: any) => {
        return (
          <Tooltip title={value}>
            <u
              className={`canClick`}
              style={{ marginLeft: '6px' }}
              onClick={() => projectNameClickEvent(record.id)}
            >
              {value}
            </u>
          </Tooltip>
        )
      },
    },
    {
      render: (_: unknown, record: any) => {
        return (
          <>
            <span className={styles.splitLine}></span>
            <span>共有项目：{record.projects.length} 个</span>
          </>
        )
      },
    },
    {
      render: (_: unknown, record: any) => {
        return (
          <>
            <span className={styles.splitLine}></span>
            <span>
              {record.startTime && record.endTime && (
                <span>
                  工程日期：{moment(record.startTime).format('YYYY/MM/DD')}-
                  {moment(record.endTime).format('YYYY/MM/DD')}
                </span>
              )}
              {record.startTime && !record.endTime && (
                <span>工程日期：{moment(record.startTime).format('YYYY/MM/DD')}</span>
              )}
              {!record.startTime && record.endTime && (
                <span>工程日期：{moment(record.endTime).format('YYYY/MM/DD')}</span>
              )}
            </span>
          </>
        )
      },
    },
    {
      render: (_: unknown, record: any) => {
        return (
          <>
            <span className={styles.splitLine}></span>
            <span>
              {record.compileTime && (
                <span>编制日期：{moment(record.compileTime).format('YYYY/MM/DD')}</span>
              )}
            </span>
          </>
        )
      },
    },
    {
      render: (_: unknown, record: any) => {
        return (
          <>
            <div style={{ textAlign: 'right', display: 'inline-block', width: '100%' }}>
              {record?.operationAuthority?.canAddProject &&
                buttonJurisdictionArray?.includes('all-project-add-project') && (
                  <Button
                    className="mr10"
                    ghost
                    type="primary"
                    onClick={() => addProjectEvent(record)}
                  >
                    新增项目
                  </Button>
                )}
              {record?.operationAuthority?.canEdit &&
                buttonJurisdictionArray?.includes('all-project-edit-engineer') && (
                  <Button className="mr10" onClick={() => editEngineerEvent(record)}>
                    编辑
                  </Button>
                )}
              {/* {record?.operationAuthority?.canEdit &&
                buttonJurisdictionArray?.includes('all-project-file-engineer') && (
                  <Button onClick={() => approvalFileEvent(record)}>批复文件</Button>
                )} */}
            </div>
          </>
        )
      },
    },
  ]

  const refreshEvent = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh()
    }
  }

  const searchEvent = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.searchByParams({
        ...searchParams,
        projectDirectoryId: selectedFavId,
        keyWord,
      })
    }
  }

  const delayRefresh = async () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      await tableRef.current.delayRefresh()
      refreshStatistics()
    }
  }

  const searchByParams = (params: any) => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.searchByParams(params)
    }
  }

  const initTableData = async (url: string, params: any) => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      await tableRef.current.urlChange(url, params)
      refreshStatistics()
    }
  }

  const screenClickEvent = (params: any) => {
    setSearchParams({ ...params, keyWord })
    searchByParams({ ...params, keyWord })
  }

  useImperativeHandle(ref, () => ({
    // 刷新
    refresh: () => {
      refreshEvent()
    },
    // 按照目前的参数进行搜索
    search: () => {
      searchEvent()
    },

    searchByParams: () => {
      searchByParams({ ...searchParams, projectDirectoryId: selectedFavId })
    },
    delayRefresh: () => {
      delayRefresh()
    },
  }))

  useEffect(() => {
    setKeyWord('')
    if (indexToPageSearchParams.projectId) {
      const searchParams = {
        ...initSearchParams,
        keyWord: '',
        projectIds: [indexToPageSearchParams.projectId],
      }
      setSearchParams(initSearchParams)
      initTableData(indexToPageSearchParams.requestUrl, { ...searchParams, keyWord: '' })
      return
    }
    if (indexToPageSearchParams.searchPerson) {
      setSearchParams({
        ...initSearchParams,
        surveyUser: String(indexToPageSearchParams.searchPerson),
        logicRelation: 1,
        designUser: String(indexToPageSearchParams.searchPerson),
        areaType: indexToPageSearchParams.areaLevel!,
        areaId: indexToPageSearchParams.areaId!,
        status: [30, 31, 14, 1, 2, 3, 4, 19, 5, 6, 11, 9, 10, 8, 7, 15] as never[],
      })
      initTableData(indexToPageSearchParams.requestUrl, {
        ...initSearchParams,
        surveyUser: String(indexToPageSearchParams.searchPerson),
        logicRelation: 1,
        designUser: String(indexToPageSearchParams.searchPerson),
        areaType: indexToPageSearchParams.areaLevel!,
        areaId: indexToPageSearchParams.areaId!,
        status: [30, 31, 14, 1, 2, 3, 4, 19, 5, 6, 11, 9, 10, 8, 7, 15] as never[],
        keyWord: '',
      })
      return
    }
    if (indexToPageSearchParams.requestUrl) {
      setSearchParams(initSearchParams)
      initTableData(indexToPageSearchParams.requestUrl, { ...initSearchParams, keyWord: '' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexToPageSearchParams])

  const columnsConfigSetting = () => {
    setChooseColumnsModal(true)
  }

  useEffect(() => {
    setKeyWord('')
    if (selectedFavId) {
      searchByParams({ ...searchParams, projectDirectoryId: selectedFavId })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFavId])

  const finalyColumns = useMemo(() => {
    if (chooseColumns) {
      return ['name', ...chooseColumns, 'sources', 'identitys', 'status', 'action']
    }
    return [
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(chooseColumns)])

  const showColumns = useMemo(() => {
    if (!typeColumns) {
      return completeConfig.filter((item) => finalyColumns.includes(item.dataIndex))
    } else {
      return completeConfig.filter((item) => typeColumns.includes(item.dataIndex))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalyColumns, typeColumns])

  const columnsIcon = (
    <span style={{ cursor: 'pointer' }} onClick={() => columnsConfigSetting()}>
      <SettingOutlined />
    </span>
  )

  const columnsSettingFinish = (checkedValue: string[]) => {
    setChooseColumns(checkedValue)
    refreshEvent()
  }

  return (
    <div className={styles.engineerTableWrapper}>
      <Divider style={{ margin: '0', padding: '8px 0' }} />
      <div className={styles.engineerTableWrapperSearch}>
        <div className={styles.engineerTableWrapperSearchLeft}>
          <TableSearch className="mr22" label="" width="300px">
            <Search
              placeholder="请输入工程/项目名称/项目编码"
              enterButton
              value={keyWord}
              onChange={(e) => setKeyWord(e.target.value)}
              onSearch={() => searchEvent()}
            />
          </TableSearch>
          {currentClickTabChildActiveType === 'agent' ||
          currentClickTabChildActiveType === 'approveing' ? (
            <Button onClick={() => setFilterAgentModalVisible(true)}>筛选</Button>
          ) : (
            <Button onClick={() => setScreenModalVisible(true)}>筛选</Button>
          )}
        </div>
        <div className={styles.engineerTableWrapperSearchRight}>{batchButtonSlot?.()}</div>
      </div>

      <div className={styles.engineerTableContent}>
        <EngineerTable
          getSelectRowData={getSelectRowData}
          getSelectRowKeys={getSelectRowKeys}
          searchParams={{ ...searchParams, keyWord }}
          ref={tableRef}
          url={indexToPageSearchParams.requestUrl}
          parentColumns={parentColumns}
          columns={showColumns}
          pagingSlot={typeColumns ? undefined : columnsIcon}
        />
      </div>

      <ScreenModal
        visible={screenModalVisible}
        onChange={setScreenModalVisible}
        finishEvent={screenClickEvent}
        searchParams={searchParams}
      />
      <FilterEntrustModal
        visible={filterAgentModalVisible}
        onChange={setFilterAgentModalVisible}
        finishEvent={screenClickEvent}
        searchParams={searchParams}
      />

      {engineerModalVisible && (
        <EngineerDetailInfo
          engineerId={modalNeedInfo.engineerId}
          visible={engineerModalVisible}
          onChange={setEngineerModalVisible}
        />
      )}
      {addProjectVisible && (
        <AddProjectModal
          companyName={modalNeedInfo.companyName}
          changeFinishEvent={delayRefresh}
          visible={addProjectVisible}
          onChange={setAddProjectVisible}
          engineerId={modalNeedInfo.engineerId}
          areaId={modalNeedInfo.areaId}
          company={modalNeedInfo.company}
        />
      )}
      {editEngineerVisible && (
        <EditEnigneerModal
          engineerId={modalNeedInfo.engineerId}
          visible={editEngineerVisible}
          onChange={setEditEngineerVisible}
          changeFinishEvent={refreshEvent}
          minStart={modalNeedInfo.minStartTime}
          maxEnd={modalNeedInfo.maxEndTime}
        />
      )}
      {approvalEngineerVisible && (
        <ApprovalProjectModal
          engineerId={modalNeedInfo.engineerId}
          visible={approvalEngineerVisible}
          onChange={setApprovalEngineerVisible}
          changeFinishEvent={refreshEvent}
        />
      )}
      {projectModalVisible && (
        <ProjectDetailInfo
          projectId={modalNeedInfo.projectId}
          judgmentMark={modalNeedInfo.judgmentMark}
          visible={projectModalVisible}
          onChange={setProjectModalVisible}
        />
      )}
      {arrangeModalVisible && (
        <ArrangeModal
          allotCompanyId={modalNeedInfo.allotCompanyId}
          finishEvent={delayRefresh}
          visible={arrangeModalVisible}
          onChange={setArrangeModalVisible}
          projectIds={[modalNeedInfo.projectId]}
          defaultSelectType={modalNeedInfo.projectType}
          dataSourceType={modalNeedInfo.projectDataSource}
          groupId={modalNeedInfo.allotGroupId}
        />
      )}
      {auditKnotModalVisible && (
        <AuditKnotModal
          visible={auditKnotModalVisible}
          onChange={setAuditKnotModalVisible}
          projectIds={[modalNeedInfo.projectId]}
          finishEvent={delayRefresh}
        />
      )}
      {externalArrangeModalVisible && (
        <ExternalArrangeModal
          projectId={modalNeedInfo.projectId}
          onChange={setExternalArrangeModalVisible}
          visible={externalArrangeModalVisible}
          search={delayRefresh}
        />
      )}
      {externalListModalVisible && (
        <ExternalListModal
          projectId={modalNeedInfo.projectId}
          visible={externalListModalVisible}
          onChange={setExternalListModalVisible}
          stepData={externalStepData}
          refresh={delayRefresh}
        />
      )}
      {editProjectVisible && (
        <EditProjectModal
          companyName={modalNeedInfo.companyName}
          projectId={modalNeedInfo.projectId}
          company={modalNeedInfo.company}
          areaId={modalNeedInfo.areaId}
          status={modalNeedInfo.status}
          startTime={modalNeedInfo.startTime}
          endTime={modalNeedInfo.endTime}
          visible={editProjectVisible}
          pointVisible={inheritState}
          setInheritState={setInheritState}
          onChange={setEditProjectVisible}
          changeFinishEvent={refreshEvent}
        />
      )}
      {copyProjectVisible && (
        <CopyProjectModal
          companyName={modalNeedInfo.companyName}
          projectId={modalNeedInfo.projectId}
          engineerId={modalNeedInfo.engineerId}
          company={modalNeedInfo.company}
          areaId={modalNeedInfo.areaId}
          visible={copyProjectVisible}
          status={modalNeedInfo.status}
          startTime={modalNeedInfo.startTime}
          endTime={modalNeedInfo.endTime}
          onChange={setCopyProjectVisible}
          changeFinishEvent={delayRefresh}
        />
      )}
      {projectInheritVisible && (
        <ProjectInheritModal
          companyName={modalNeedInfo.companyName}
          projectId={modalNeedInfo.projectId}
          company={modalNeedInfo.company}
          areaId={modalNeedInfo.areaId}
          status={modalNeedInfo.status}
          startTime={modalNeedInfo.startTime}
          endTime={modalNeedInfo.endTime}
          engineerId={modalNeedInfo.engineerId}
          visible={projectInheritVisible}
          onChange={setProjectInheritVisible}
          changeFinishEvent={refreshEvent}
        />
      )}
      {reportApproveVisible && (
        <ReportApproveModal
          visible={reportApproveVisible}
          onChange={setReportApproveVisible}
          finishEvent={delayRefresh}
          projectIds={modalNeedInfo.projectId}
        />
      )}
      {approvingModalVisible && (
        <ApproveModal
          visible={approvingModalVisible}
          onChange={setApprovingModalVisible}
          finishEvent={delayRefresh}
          projectIds={modalNeedInfo.projectId}
        />
      )}
      {chooseColumnsModal && (
        <ColumnsConfigModal
          hasCheckColumns={chooseColumns}
          visible={chooseColumnsModal}
          onChange={setChooseColumnsModal}
          finishEvent={columnsSettingFinish}
        />
      )}
      {projectMergeVisible && (
        <ProjectMergeModal
          visible={projectMergeVisible}
          onChange={setProjectMergeVisible}
          finishEvent={delayRefresh}
          projectId={modalNeedInfo.projectId}
        />
      )}
      {archiveVisible && (
        <ArchiveModal
          visible={archiveVisible}
          onChange={setArchiveVisible}
          finishEvent={delayRefresh}
          projectId={modalNeedInfo.projectId}
        />
      )}
    </div>
  )
}

export default forwardRef(EngineerTableWrapper)
