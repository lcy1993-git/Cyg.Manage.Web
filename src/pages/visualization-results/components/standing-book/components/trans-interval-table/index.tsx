import { getIntervalByTransformer } from '@/services/grid-manage/treeMenu'
import { TransIntervalType } from '@/services/visualization-results/list-menu'
import { useControllableValue, useRequest } from 'ahooks'
import { Modal, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Dispatch, FC, SetStateAction } from 'react'

interface TransIntervalTableProps {
  transId: string
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
}
export const TransIntervalTable: FC<TransIntervalTableProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { transId } = props

  const { data, loading } = useRequest(getIntervalByTransformer({ transformerId: transId }))

  const columns: ColumnsType<TransIntervalType> = [
    {
      title: '电压等级',
      width: 100,
      dataIndex: 'type',
      key: 'type',
      fixed: 'left',
      // render: (text, record, idx) => (record.children ? idx + 1 : null),
    },

    {
      title: '公用',
      width: 200,
      dataIndex: 'publicuse',
      key: 'publicuse',
    },
    {
      title: '备用',
      width: 500,
      dataIndex: 'spare',
      key: 'spare',
    },
    {
      title: '专用',
      width: 150,
      dataIndex: 'specialPurpose',
      key: 'specialPurpose',
    },
    {
      title: '总数',
      width: 150,
      dataIndex: 'total',
      key: 'total',
    },
  ]
  return (
    <Modal
      maskClosable={false}
      bodyStyle={{ padding: '24px 24px 0' }}
      title="出线间隔"
      width="450px"
      visible={state as boolean}
      destroyOnClose
      okText="确定"
      footer=""
      cancelText="取消"
      onCancel={() => setState(false)}
    >
      <Table
        columns={columns}
        bordered
        size="middle"
        rowKey="id"
        pagination={false}
        dataSource={data}
        loading={loading}
        scroll={{ x: 1400, y: 690 }}
        defaultExpandAllRows
      />
    </Modal>
  )
}

export default TransIntervalTable
