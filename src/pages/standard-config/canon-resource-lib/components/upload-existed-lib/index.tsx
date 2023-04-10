import EmptyTip from '@/components/empty-tip'
import TableSearch from '@/components/table-search'
import { existedLibImport, getAllLib } from '@/services/resource-config/resource-lib'
import { useControllableValue } from 'ahooks'
import { Button, Input, message, Modal, Table } from 'antd'
import { isArray } from 'lodash'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
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
  const { libId = '', changeFinishEvent } = props
  const [tableData, setTableData] = useState<any>([])
  const [copyTableData, setCopyTableData] = useState<any>([])
  const [loading, setLoading] = useState(false)

  const search = () => {
    const newData = copyTableData.filter((item: any) => {
      return item.libName.includes(keyWord)
    })
    setTableData(newData)
  }
  const onSave = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行')
      return
    }
    setLoading(true)
    try {
      await existedLibImport({
        fromId: tableSelectRows[0],
        targetId: libId,
      })
      setLoading(false)
      message.info('导入成功')
      setState(false)
    } catch (error) {
      setLoading(false)
    }
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
  useEffect(() => {
    getAllLib().then((res) => {
      setTableData(res)
      setCopyTableData(res)
    })
  }, [])
  const rowSelection = {
    onChange: (values: any[], selectedRows: any[]) => {
      setTableSelectRows(selectedRows.map((item) => item['id']))
    },
  }
  useEffect(() => {
    if (state) {
      const data = copyTableData.filter((item: any) => {
        return item.id !== libId
      })
      setTableData(data)
      setCopyTableData(data)
    }
  }, [state])
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
          <Button key="save" type="primary" onClick={onSave} loading={loading}>
            保存
          </Button>,
        ]}
        onCancel={() => setState(false)}
        destroyOnClose
        bodyStyle={{ height: 820, overflowY: 'auto' }}
        width={750}
      >
        <div style={{ padding: `10px 0 20px 0` }}>
          <TableSearch className="mr22" label="资源库名称" width="248px">
            <Search
              placeholder="请输入资源库名称"
              enterButton
              value={keyWord}
              onChange={(e) => setKeyWord(e.target.value)}
              onSearch={() => search()}
            />
          </TableSearch>
        </div>
        <Table
          columns={tableColumns}
          dataSource={tableData}
          rowKey="id"
          pagination={false}
          bordered={true}
          locale={{
            emptyText: <EmptyTip className="pt20 pb20" />,
          }}
          rowSelection={{
            type: 'radio',
            columnWidth: '38px',
            selectedRowKeys: tableSelectRows,
            ...rowSelection,
          }}
        />
      </Modal>
    </>
  )
}

export default UploadExistedLib
