import GeneralTable from '@/components/general-table'
import TableSearch from '@/components/table-search'
import EngineerDetailInfo from '@/pages/project-management/all-project/components/engineer-detail-info'
import { getComparisonResult } from '@/services/project-management/all-project'
import { useControllableValue, useRequest } from 'ahooks'
import { Button, Input, message, Modal, Spin } from 'antd'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import styles from './index.less'
const { Search } = Input

interface ProjectRemovalModalProps {
  visible: boolean
  projectId: string[]
  onChange: Dispatch<SetStateAction<boolean>>
  finishEvent: () => void
}

const ProjectRemovalModal: React.FC<ProjectRemovalModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [companyId, setCompanyId] = useState('')
  const [keyWord, setKeyWord] = useState('')
  const [checkData, setCheckData] = useState<any>([])
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [engineerModalVisible, setEngineerModalVisible] = useState<boolean>(false)

  const [currentClickEngineerId, setCurrentClickEngineerId] = useState<string>('')
  const [mergeLoading, setMergeLoading] = useState<boolean>(false)
  const { finishEvent, projectId } = props

  const { data = [], run, loading } = useRequest(getComparisonResult, {
    manual: true,
    onSuccess: () => {
      if (data) {
        setCheckData(data)
      }
    },
  })

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

  const tableColumns = [
    {
      dataIndex: 'engineer',
      index: 'engineer',
      title: '工程',
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
          <Button type="primary" onClick={() => checkMergeEvent()}>
            确认迁移
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
    await run({
      sourceProjectId: projectId,
      targetProjectId: targetId,
    })
    finishEvent?.()
  }

  const closeEvent = () => {
    setState(false)
  }

  useEffect(() => {
    if (state) {
      resetSelectedRows()
    }
  }, [state])

  return (
    <Modal
      maskClosable={false}
      title="项目迁移"
      width={750}
      visible={state as boolean}
      destroyOnClose
      footer={null}
      onCancel={() => closeEvent()}
      bodyStyle={{ padding: '12px 24px 0px', height: '550px' }}
    >
      <>
        <div className={styles.removalTitle}>
          *项目仅可在您立项的工作之间进行迁移；以下列表仅列出符合上述条件的工程；
        </div>
        {/* <div className={styles.mergeTitle}>&nbsp;</div> */}
        <Spin spinning={loading} tip="项目迁移中...">
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
        </Spin>
      </>

      <div className={styles.checkMergeTips}>
        <div className={styles.checkIcon}></div>
      </div>

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

export default ProjectRemovalModal
