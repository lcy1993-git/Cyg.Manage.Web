import GeneralTable from '@/components/general-table'
import TableSearch from '@/components/table-search'
import { useControllableValue } from 'ahooks'
import { Input, Modal } from 'antd'
import React, { Dispatch, SetStateAction, useRef, useState } from 'react'

interface ClampMapProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  libId?: string
  securityKey?: string
  requestSource: 'project' | 'resource' | 'upload'
}

const { Search } = Input
const ClampMap: React.FC<ClampMapProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })

  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const { libId = '' } = props
  const tableRef = useRef<HTMLDivElement>(null)

  const columns = [
    {
      title: '导线物料编码',
      dataIndex: 'wireCode',
      index: 'wireCode',
      width: 200,
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
      index: 'materialName',
      width: 220,
    },
    {
      title: '规格型号',
      dataIndex: 'wireType',
      index: 'wireType',
      width: 220,
    },
    {
      title: '线夹物料编码',
      dataIndex: 'clampCode',
      index: 'clampCode',
      width: 220,
    },
    {
      title: '线夹类型',
      dataIndex: 'clampType',
      index: 'clampType',
      width: 240,
    },
    {
      title: '线夹型号',
      dataIndex: 'clampModel',
      index: 'clampModel',
      width: 240,
    },
  ]

  const search = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.search()
    }
  }

  const tableLeftSlot = (
    <TableSearch width="248px">
      <Search
        value={searchKeyWord}
        onChange={(e) => setSearchKeyWord(e.target.value)}
        onSearch={() => search()}
        enterButton
        placeholder="请输入关键词搜索"
        allowClear
      />
    </TableSearch>
  )

  return (
    <>
      <Modal
        maskClosable={false}
        title="线夹导线映射列表"
        visible={state as boolean}
        footer=""
        width="92%"
        onCancel={() => setState(false)}
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
        destroyOnClose
      >
        <GeneralTable
          buttonLeftContentSlot={() => tableLeftSlot}
          ref={tableRef}
          url="/Material/GetClampMapList"
          columns={columns}
          type="radio"
          requestSource="resource"
          extractParams={{
            libId: libId,
            keyWord: searchKeyWord,
          }}
        />
      </Modal>
    </>
  )
}

export default ClampMap
