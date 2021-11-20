import CyTag from '@/components/cy-tag'
import AddProjectModal from '@/pages/project-management/all-project/components/add-project-modal'
import ApprovalProjectModal from '@/pages/project-management/all-project/components/approval-project-modal'
import EditEnigneerModal from '@/pages/project-management/all-project/components/edit-engineer-modal'
import EngineerDetailInfo from '@/pages/project-management/all-project/components/engineer-detail-info'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { BarsOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu, Tooltip } from 'antd'
import moment from 'moment'
import uuid from 'node-uuid'
import React, { useState } from 'react'
import EngineerTable from '../engineer-table'
import styles from './index.less'

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

const EngineerTableWrapper = () => {
  const [modalNeedInfo, setModalInfo] = useState<any>({
    engineerId: '',
    areaId: '',
    company: '',
    companyName: '',
  })
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()
  // 工程详情
  const [engineerModalVisible, setEngineerModalVisible] = useState(false)
  // 新增项目
  const [addProjectVisible, setAddProjectVisible] = useState(false)
  // 编辑工程信息
  const [editEngineerVisible, setEditEngineerVisible] = useState<boolean>(false)
  // 批复文件上传
  const [approvalEngineerVisible, setApprovalEngineerVisible] = useState<boolean>(false)

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

  const projectItemMenu = (
    jurisdictionInfo: JurisdictionInfo,
    tableItemData: any,
    engineerInfo: any,
    status: any
  ) => {
    return (
      <Menu>
        {jurisdictionInfo.canEdit &&
          buttonJurisdictionArray?.includes('all-project-edit-project') && (
            <Menu.Item>编辑</Menu.Item>
          )}
        {jurisdictionInfo.canCopy &&
          buttonJurisdictionArray?.includes('all-project-copy-project') && (
            <Menu.Item>复制项目</Menu.Item>
          )}
        {/* {buttonJurisdictionArray?.includes('all-project-check-result') && (
          <Menu.Item
            onClick={() =>
              checkResult({
                projectId: tableItemData.id,
                projectName: tableItemData.name,
                projectStatus: tableItemData.stateInfo.statusText,
                projectStage: tableItemData.stageText,
              })
            }
          >
            查看成果
          </Menu.Item>
        )} */}
        {jurisdictionInfo.canInherit && buttonJurisdictionArray?.includes('all-project-inherit') && (
          // all-project-inherit
          <Menu.Item>项目继承</Menu.Item>
        )}
      </Menu>
    )
  }

  const projectNameRender = (value: string, record: any) => {
    // 代表未继承
    if (!record.stateInfo.inheritStatus) {
      return <u className="canClick">{record.name}</u>
    }
    if (record.stateInfo.inheritStatus) {
      if (record.stateInfo.inheritStatus === 1) {
        return <span className={styles.disabled}>[继承中...]{record.name}</span>
      }
      if (record.stateInfo.inheritStatus === 2) {
        return <u className="canClick">{record.name}</u>
      }
      if (record.stateInfo.inheritStatus === 3) {
        return <span className={styles.disabled}>{record.name}</span>
      }
    }
  }

  const completeConfig = [
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 300,
      render: projectNameRender,
      fixed: 'left',
      ellipsis: true,
      //   iconSlot: (record: any, projects: any) => {
      //     const parentData = projects.filter((item: any) => item.id === record.inheritId)

      //     if (record.stateInfo.inheritStatus && parentData && parentData.length > 0) {
      //       if (record.stateInfo.inheritStatus === 3) {
      //         return (
      //           <>
      //             <Tooltip title={`继承自${record.inheritName}`}>
      //               <span className={styles.inheritIcon}>
      //                 <LinkOutlined />
      //               </span>
      //             </Tooltip>
      //             <span>
      //               <Popconfirm
      //                 title="项目继承失败，请重试"
      //                 onConfirm={() => againInheritEvent(record.id)}
      //                 onCancel={() => deleteFailProject(record.id)}
      //                 okText="确认"
      //                 cancelText="取消"
      //               >
      //                 <span className={styles.dangerColor}>[继承失败]</span>
      //               </Popconfirm>
      //             </span>
      //           </>
      //         )
      //       }
      //       return (
      //         <Tooltip title={`继承自${record.inheritName}`}>
      //           <span className={styles.inheritIcon}>
      //             <LinkOutlined />
      //           </span>
      //         </Tooltip>
      //       )
      //     }
      //   },
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
        return natureTexts.map((item: any) => {
          return (
            <CyTag key={uuid.v1()} className="mr7">
              {item}
            </CyTag>
          )
        })
      },
    },
    {
      title: '项目起止时间',
      dataIndex: 'projectTime',
      width: 190,
      ellipsis: true,
      render: (value: string, record: any) => {
        const { startTime, endTime } = record
        if (startTime && endTime) {
          return `${moment(startTime).format('YYYY-MM-DD')} 至 ${moment(endTime).format(
            'YYYY-MM-DD'
          )}`
        }
        if (startTime && !endTime) {
          return `开始时间: ${moment(startTime).format('YYYY-MM-DD')}`
        }
        if (!startTime && endTime) {
          return `截止时间: ${moment(startTime).format('YYYY-MM-DD')}`
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
    },
    {
      title: '所属市公司',
      dataIndex: 'cityCompany',
      width: 120,
      ellipsis: true,
    },
    {
      title: '所属县公司',
      dataIndex: 'countyCompany',
      width: 120,
      ellipsis: true,
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
      title: '现场数据来源',
      dataIndex: 'dataSourceTypeText',
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
            {buttonJurisdictionArray?.includes('export-coordinate') &&
              (record.exportCoordinate === true ? (
                <span
                  style={{ cursor: 'pointer' }}
                  className="colorRed"
                  //   onClick={() => {
                  //     modifyExportPowerState({
                  //       isEnable: !status,
                  //       projectIds: [record.id],
                  //     })
                  //     finishEvent?.()
                  //   }}
                >
                  启用
                </span>
              ) : (
                <span
                  style={{ cursor: 'pointer' }}
                  className="colorPrimary"
                  //   onClick={() => {
                  //     modifyExportPowerState({
                  //       isEnable: !status,
                  //       projectIds: [record.id],
                  //     })
                  //     finishEvent?.()
                  //   }}
                >
                  禁用
                </span>
              ))}
            {!buttonJurisdictionArray?.includes('export-coordinate') &&
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
        return record.surveyUser ? `${record.surveyUser.value}` : '无需安排'
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
            {/* {buttonJurisdictionArray?.includes('all-project-copy-project') && (
              <span>
                {!stateInfo.isArrange &&
                identitys.findIndex((item: any) => item.value === 4) > -1 ? (
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
                  <span
                    className="canClick"
                    onClick={() => {
                      setCurrentClickProjectId(record.id)
                      setAuditKnotModalVisible(true)
                    }}
                  >
                    {stateInfo?.statusText}
                  </span>
                ) : stateInfo.status === 8 && stateInfo.outsideStatus === 95 ? (
                  <span
                    className="canClick"
                    onClick={() => externalArrange(record.id, record.name)}
                  >
                    {stateInfo?.outsideStatusText}
                  </span>
                ) : stateInfo.status === 8 && stateInfo.outsideStatus === 100 ? (
                  <span className="canClick" onClick={() => externalEdit(record.id)}>
                    {stateInfo?.outsideStatusText}
                  </span>
                ) : stateInfo.status === 8 && stateInfo.outsideStatus === 105 ? (
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
            )} */}
          </>
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 60,
      fixed: 'right',
      render: (value: string, record: any, engineerInfo: any) => {
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
              projectItemMenu(operationAuthority, record, engineerInfo, record.stateInfo.status)
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
              {record?.operationAuthority?.canEdit &&
                buttonJurisdictionArray?.includes('all-project-file-engineer') && (
                  <Button onClick={() => approvalFileEvent(record)}>批复文件</Button>
                )}
            </div>
          </>
        )
      },
    },
  ]

  const refreshEvent = () => {}

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <EngineerTable parentColumns={parentColumns} columns={completeConfig} />
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
          changeFinishEvent={refreshEvent}
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
    </div>
  )
}

export default EngineerTableWrapper
