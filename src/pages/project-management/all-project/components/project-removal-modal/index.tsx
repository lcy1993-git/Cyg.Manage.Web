import GeneralTable from '@/components/general-table'
import TableSearch from '@/components/table-search'
import EngineerDetailInfo from '@/pages/project-management/all-project/components/engineer-detail-info'
import {
  checkCanRemoval,
  getComparisonResult,
  sureRemoval,
} from '@/services/project-management/all-project'
import { useControllableValue, useRequest } from 'ahooks'
import { Button, Input, message, Modal, Spin } from 'antd'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import styles from './index.less'
const { Search } = Input

interface ProjectRemovalModalProps {
  visible: boolean
  projectIds: string[]
  onChange: Dispatch<SetStateAction<boolean>>
  finishEvent: () => void
}

const ProjectRemovalModal: React.FC<ProjectRemovalModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [keyWord, setKeyWord] = useState('')
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [engineerModalVisible, setEngineerModalVisible] = useState<boolean>(false)

  const [currentClickEngineerId, setCurrentClickEngineerId] = useState<string>('')
  // const [mergeLoading, setMergeLoading] = useState<boolean>(false)
  const { finishEvent, projectIds } = props

  const { run, loading } = useRequest(checkCanRemoval, {
    manual: true,
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
      dataIndex: 'value',
      index: 'value',
      title: '工程',
      render: (text: any, record: any) => {
        return (
          <u
            className="canClick"
            onClick={() => {
              setCurrentClickEngineerId(record.value)
              setEngineerModalVisible(true)
            }}
          >
            {record.text}
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
          <Button type="primary" onClick={() => checkRemovalEvent()}>
            确认迁移
          </Button>
        </div>
      </>
    )
  }

  const checkRemovalEvent = async () => {
    if (tableSelectRows && tableSelectRows.length === 0) {
      message.warning('请选择需要迁入的工程')
      return
    }

    const targetId = tableSelectRows[0].value

    await run({ projectIds: projectIds })
    sureRemoval({
      targetEngineerId: targetId,
      projectIds: projectIds,
    })
      .then(() => {
        message.success('迁移成功')
        closeEvent()
        finishEvent?.()
      })
      .catch((err: string) => {})
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
      bodyStyle={{ padding: '20px 24px 0px', height: '600px', overflowY: 'auto' }}
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
            extractParams={{ projectIds: projectIds, keyWord: keyWord }}
            needTitleLine={false}
            rowKey="value"
            url="/PorjectMigrate/GetTargetEngineers"
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
