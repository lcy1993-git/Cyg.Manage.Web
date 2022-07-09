import { equipKvLevel, getIntervalByTransformer } from '@/services/grid-manage/treeMenu'
import { TransIntervalType } from '@/services/visualization-results/list-menu'
import { useControllableValue, useRequest } from 'ahooks'
import { Button, Modal, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import styles from './index.less'

interface TransIntervalTableProps {
  transId: string
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  dataOnchange: Dispatch<SetStateAction<any[]>>
  intervalData: any[]
}
export const TransIntervalTable: FC<TransIntervalTableProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { transId, dataOnchange, intervalData } = props
  const [tableSelectArray, setTableSelectArray] = useState<any[]>([])

  // const { data, loading } = useRequest(getIntervalByTransformer({ transformerId: transId }))

  // console.log(data, '111')

  const columns: ColumnsType<TransIntervalType> = [
    {
      title: '电压等级',
      width: '19.5%',
      dataIndex: 'type',
      key: 'type',
      fixed: 'left',
      render: (text: any, record: any) => {
        return equipKvLevel[record.type]
      },
    },

    {
      title: '公用',
      width: '19.5%',
      dataIndex: 'publicuse',
      key: 'publicuse',
    },
    {
      title: '备用',
      width: '19.5%',
      dataIndex: 'spare',
      key: 'spare',
    },
    {
      title: '专用',
      width: '19.5%',
      dataIndex: 'specialPurpose',
      key: 'specialPurpose',
    },
    {
      title: '总数',
      width: '19.5%',
      dataIndex: 'total',
      key: 'total',
    },
  ]

  const tableSelection = {
    onChange: (values: any[], selectedRows: any[]) => {
      setTableSelectArray(selectedRows.map((item) => item['type']))
    },
  }

  return (
    <Modal
      maskClosable={false}
      // bodyStyle={{ padding: '24px 24px 0' }}
      title="出线间隔"
      width="45%"
      visible={state as boolean}
      destroyOnClose
      okText="确定"
      footer=""
      cancelText="取消"
      onCancel={() => setState(false)}
    >
      <div className={styles.buttonArea}>
        <Button type="primary" className="mr7" onClick={() => {}}>
          添加/编辑
        </Button>
        <Button>删除</Button>
      </div>
      <div className={styles.intervalTable}>
        <Table
          columns={columns}
          bordered
          size="middle"
          rowKey="type"
          pagination={false}
          dataSource={intervalData}
          defaultExpandAllRows
          rowSelection={{
            type: 'radio',
            columnWidth: '15px',
            selectedRowKeys: tableSelectArray,
            ...tableSelection,
          }}
        />
      </div>
    </Modal>
  )
}

export default TransIntervalTable
