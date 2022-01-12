import DataSelect from '@/components/data-select'
import GeneralTable from '@/components/general-table'
import ImageIcon from '@/components/image-icon'
import TableSearch from '@/components/table-search'
import { getComparisonResult, saveProjectMerge } from '@/services/project-management/all-project'
import { useGetSelectData } from '@/utils/hooks'
import { useControllableValue, useRequest } from 'ahooks'
import { Button, Input, message, Modal, Spin, Table } from 'antd'
import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import EngineerDetailInfo from '@/pages/project-management/all-project/components/engineer-detail-info'
import ProjectDetailInfo from '@/pages/project-management/all-project/components/project-detail-info'
import styles from './index.less'
const { Search } = Input

interface ProjectMergeModalProps {
  visible: boolean
  projectId: string
  onChange: Dispatch<SetStateAction<boolean>>
  finishEvent: () => void
}

const ProjectMergeModal: React.FC<ProjectMergeModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [requestLoading, setRequestLoading] = useState<boolean>(false)
  const [companyId, setCompanyId] = useState('')
  const [targetProjectId, setTargetProjectId] = useState<string>('')
  const [keyWord, setKeyWord] = useState('')
  const [checkData, setCheckData] = useState<any>([])
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [engineerModalVisible, setEngineerModalVisible] = useState<boolean>(false)
  const [projectModalVisible, setProjectModalVisible] = useState<boolean>(false)
  const [currentClickProjectId, setCurrentClickProjectId] = useState<string>('')
  const [currentClickEngineerId, setCurrentClickEngineerId] = useState<string>('')
  const [mergeLoading, setMergeLoading] = useState<boolean>(false)
  const { finishEvent, projectId } = props

  const { data: companyData = [] } = useGetSelectData({
    url: '/ProjectMerge/GetTargetProjectCompanys',
    method: 'post',
    titleKey: 'text',
    valueKey: 'value',
  })

  const { data = [], run, loading } = useRequest(getComparisonResult, {
    manual: true,
    onSuccess: () => {
      if (data) {
        setCheckData(data)
      }
    },
  })

  //判断是否校验全部通过
  const isAllCheckPass = useMemo(() => {
    if (checkData) {
      return checkData
        ?.map((item: any) => {
          return item.equality
        })
        .includes(false)
    }
  }, [checkData])

  const tableRef = useRef<HTMLDivElement>(null)

  const search = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.search()
    }
  }

  const resetSelectedRows = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.resetSelectedRows()
    }
  }

  const searchByCompany = (value: any) => {
    setCompanyId(value)
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.searchByParams({
        companyId: value,
      })
    }
  }

  const tableColumns = [
    {
      dataIndex: 'engineer',
      index: 'engineer',
      title: '工程',
      width: '50%',
      render: (text: any, record: any) => {
        return (
          <u
            className="canClick"
            onClick={() => {
              setCurrentClickEngineerId(record.engineer.value)
              setEngineerModalVisible(true)
            }}
          >
            {record.engineer.text}
          </u>
        )
      },
    },
    {
      dataIndex: 'project',
      index: 'project',
      title: '项目',
      width: '50%',
      render: (text: any, record: any) => {
        return (
          <u
            className="canClick"
            onClick={() => {
              setCurrentClickProjectId(record.project.value)
              setProjectModalVisible(true)
            }}
          >
            {record.project.text}
          </u>
        )
      },
    },
  ]

  const mergeColumns = [
    {
      dataIndex: 'item',
      index: 'item',
      title: '校验条目',
      width: 280,
      onCell: () => {
        return {
          style: {
            backgroundColor: '#fafafa',
          },
        }
      },
    },
    {
      dataIndex: 'targetValue',
      index: 'targetValue',
      title: '目标项目',
      width: 320,
    },
    {
      dataIndex: 'sourceValue',
      index: 'sourceValue',
      title: '当前项目',
      width: 320,
    },
    {
      dataIndex: 'equality',
      index: 'equality',
      title: '结果',
      width: 80,
      render: (text: any, record: any) => {
        return record.equality ? (
          <ImageIcon width={18} height={18} imgUrl="pass.png" />
        ) : (
          <ImageIcon width={18} height={18} imgUrl="fail.png" />
        )
      },
    },
  ]

  const tableButton = () => {
    return (
      <>
        <TableSearch className="mr7" width="258px">
          <Search
            placeholder="请输入工程名称"
            enterButton
            value={keyWord}
            onChange={(e) => setKeyWord(e.target.value)}
            onSearch={() => search()}
          />
        </TableSearch>
      </>
    )
  }

  const tableButtonRightContent = () => {
    return (
      <>
        <div className="flex">
          <TableSearch className="mr77" label="立项公司" width="260px">
            <DataSelect
              style={{ width: '100%' }}
              allowClear
              onChange={(value: any) => searchByCompany(value)}
              placeholder="-全部-"
              options={companyData}
            />
          </TableSearch>
          <Button type="primary" onClick={() => checkMergeEvent()} loading={requestLoading}>
            合并校验
          </Button>
        </div>
      </>
    )
  }

  const checkMergeEvent = async () => {
    if (tableSelectRows && tableSelectRows.length === 0) {
      message.warning('请选择需要合并的项目')
      return
    }

    const targetId = tableSelectRows[0].project.value
    setTargetProjectId(targetId)
    await run({
      sourceProjectId: projectId,
      targetProjectId: targetId,
    })
    setRequestLoading(true)
  }

  const closeEvent = () => {
    setState(false)
  }

  const mergeConfirm = async () => {
    setMergeLoading(true)
    await saveProjectMerge({
      sourceProjectId: projectId,
      targetProjectId: targetProjectId,
    })
      .then(() => {
        setMergeLoading(false)
        message.success('项目合并成功')
        finishEvent?.()
        setState(false)
      })
      .catch(() => {
        setMergeLoading(false)
      })
  }

  useEffect(() => {
    if (state) {
      resetSelectedRows()
    }
  }, [state])

  return (
    <Modal
      maskClosable={false}
      title="项目合并"
      width={750}
      visible={state as boolean}
      destroyOnClose
      footer={null}
      onCancel={() => closeEvent()}
      bodyStyle={{ padding: '12px 24px 0px', height: requestLoading ? '445px' : '635px' }}
    >
      {!requestLoading ? (
        <>
          <div className={styles.mergeTitle}>
            *该功能可以将您立项的项目合并至其他公司委托给您的项目当中，将保留您立项的项目的全部设计数据；
          </div>
          <div className={styles.mergeTitle}>
            &nbsp;需要确保您的项目关键属性和目标项目一致，可点击右侧进行校验，其余项目属性将直接替换为目标项目属性；
          </div>
          <GeneralTable
            ref={tableRef}
            getSelectData={(data) => setTableSelectRows(data)}
            buttonRightContentSlot={tableButtonRightContent}
            buttonLeftContentSlot={tableButton}
            columns={tableColumns}
            extractParams={{ companyId: companyId, keyWord: keyWord }}
            needTitleLine={false}
            rowKey="project"
            url="/ProjectMerge/GetTargetProjects"
          />
        </>
      ) : (
        <Spin spinning={loading || mergeLoading} tip="项目合并中...">
          <div className={styles.checkMergeTips}>
            <div className={styles.checkIcon}>
              {isAllCheckPass ? (
                <>
                  <ImageIcon width={18} height={18} imgUrl="fail.png" marginRight={5} />
                  <span>校验未通过，请修改项目属性后重试</span>
                </>
              ) : (
                <>
                  <ImageIcon width={18} height={18} imgUrl="pass.png" marginRight={5} />
                  <span>校验通过</span>
                </>
              )}
            </div>

            <Button type="primary" onClick={() => mergeConfirm()} disabled={isAllCheckPass}>
              确认合并
            </Button>
          </div>
          <Table
            columns={mergeColumns}
            bordered
            pagination={false}
            size={'small'}
            dataSource={checkData}
          />
        </Spin>
      )}
      {projectModalVisible && (
        <ProjectDetailInfo
          projectId={currentClickProjectId}
          visible={projectModalVisible}
          onChange={setProjectModalVisible}
        />
      )}

      {engineerModalVisible && (
        <EngineerDetailInfo
          engineerId={currentClickEngineerId}
          visible={engineerModalVisible}
          onChange={setEngineerModalVisible}
        />
      )}
    </Modal>
  )
}

export default ProjectMergeModal
