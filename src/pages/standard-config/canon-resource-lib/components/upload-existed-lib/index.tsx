import GeneralTable from '@/components/general-table'
import TableSearch from '@/components/table-search'
import { useControllableValue } from 'ahooks'
import { Button, Input, message, Modal } from 'antd'
import { isArray } from 'lodash'
import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
const { Search } = Input

interface UploadAllProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent?: () => void
  libId?: string
  requestSource: 'project' | 'resource' | 'upload'
}

const UploadExistedLib: React.FC<UploadAllProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [keyWord, setKeyWord] = useState('')
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const { libId = '', requestSource, changeFinishEvent } = props

  const tableRef = useRef<HTMLDivElement>(null)

  const search = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.search()
    }
  }
  const onSave = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行')
      return
    }
    // console.log(libId,tableSelectRows[0].id)
    message.info('222')
    changeFinishEvent?.()
  }
  const tableColumns = [
    {
      dataIndex: 'libName',
      index: 'libName',
      title: '名称',
      width: 280,
    },
    {
      dataIndex: 'version',
      index: 'version',
      title: '版本',
      width: 140,
    },
    {
      dataIndex: 'remark',
      index: 'remark',
      title: '备注',
      //   width: 200,
    },
  ]
  const tableButton = () => {
    return (
      <>
        <TableSearch className="mr22" label="资源库名称" width="248px">
          <Search
            placeholder="请输入资源库名称"
            enterButton
            value={keyWord}
            onChange={(e) => setKeyWord(e.target.value)}
            onSearch={() => search()}
          />
        </TableSearch>
      </>
    )
  }

  return (
    <>
      <Modal
        maskClosable={false}
        title="已有库导入"
        visible={state as boolean}
        footer={[
          <Button key="cancle" onClick={() => setState(false)}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={onSave}>
            保存
          </Button>,
        ]}
        onCancel={() => setState(false)}
        destroyOnClose
        // bodyStyle={{height:'600px'}}
        width={750}
      >
        <GeneralTable
          ref={tableRef}
          type="radio"
          getSelectData={(data) => setTableSelectRows(data)}
          buttonLeftContentSlot={tableButton}
          columns={tableColumns}
          extractParams={{ keyWord }}
          needTitleLine={false}
          requestSource="resource"
          url="/ResourceLib/GetPageList"
        />
      </Modal>
    </>
  )
}

export default UploadExistedLib
