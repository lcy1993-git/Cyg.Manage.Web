import DataSelect from '@/components/data-select'
import GeneralTable from '@/components/general-table'
import TableSearch from '@/components/table-search'
import { modifyMultipleEngineerLib } from '@/services/project-management/all-project'
import { useGetSelectData } from '@/utils/hooks'
import { useControllableValue } from 'ahooks'
import { Button, Input, message, Modal } from 'antd'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import styles from './index.less'
const { Search } = Input

interface ProjectMergeModalProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  finishEvent: () => void
}

const ProjectMergeModal: React.FC<ProjectMergeModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [requestLoading, setRequestLoading] = useState(false)
  const [keyWord, setKeyWord] = useState('')
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [libId, setLibId] = useState<string>('')
  const { finishEvent } = props

  const { data: libSelectData = [] } = useGetSelectData({
    url: '/ResourceLib/GetList?status=1',
    requestSource: 'resource',
    titleKey: 'libName',
    valueKey: 'id',
  })

  const tableRef = useRef<HTMLDivElement>(null)

  const search = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.search()
    }
  }

  const refresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.refresh()
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
      dataIndex: 'engineerName',
      index: 'engineerName',
      title: '工程',
      width: '50%',
      //   onCell: () => {
      //     return {
      //       style: {
      //         overflow: 'hidden',
      //         whiteSpace: 'nowrap' as 'nowrap',
      //         textOverflow: 'ellipsis',
      //       },
      //     }
      //   },
    },
    {
      dataIndex: 'project',
      index: 'project',
      title: '项目',
      width: '50%',
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
          <TableSearch className="mr77" label="立项公司" width="272px">
            <DataSelect
              style={{ width: '100%' }}
              value={libId}
              onChange={(value) => setLibId(value as string)}
              placeholder="公司名称"
              options={libSelectData}
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
    // if (!libId) {
    //   message.error('请选择立项公司')
    //   return
    // }
    // if (tableSelectRows.length === 0) {
    //   message.error('请选择需要合并的项目')
    //   return
    // }

    setRequestLoading(true)
    // const engineerIds = tableSelectRows.map((item) => item.engineerId)
    // try {
    //   await modifyMultipleEngineerLib({
    //     engineerIds: engineerIds,
    //     libId: libId,
    //   })
    //   message.success('批量变更资源库成功')
    //   resetSelectedRows()
    //   refresh()
    // } catch (msg) {
    //   console.error(msg)
    // } finally {
    //   setRequestLoading(false)
    // }
  }

  const closeEvent = () => {
    setState(false)
    // finishEvent?.()
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
            extractParams={{ keyWord }}
            needTitleLine={false}
            rowKey="engineerId"
            url="/Engineer/GetEngineerByLibList"
          />
        </>
      ) : (
        <div>111</div>
      )}
    </Modal>
  )
}

export default ProjectMergeModal
