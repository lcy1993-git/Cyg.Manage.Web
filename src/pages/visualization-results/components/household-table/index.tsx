import { HouseholdDataType } from '@/services/visualization-results/list-menu'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import { FC } from 'react'

export interface HouseholdTableProps {
  data?: HouseholdDataType[]
  loading: boolean
}

const stateMenu = {
  0: '无',
  1: '原有',
  2: '新建',
  3: '利旧',
  4: '拆除',
}

const kvEnum = {
  0: '无',
  1: '220V',
  2: '380V',
  3: '10kV',
}

export const columns: ColumnsType<HouseholdDataType> = [
  {
    title: '长度(m)',
    width: 80,
    dataIndex: 'length',
    key: 'length',
  },
  {
    title: '状态',
    width: 80,
    dataIndex: 'state',
    key: 'state',
    render: (text: any, record: any) => {
      return stateMenu[record.state]
    },
  },
  {
    title: '电压等级',
    width: 80,
    dataIndex: 'kvLevel',
    key: 'kvLevel',
    render: (text: any, record: any) => {
      return kvEnum[record.kvLevel]
    },
  },
  {
    title: '型号',
    dataIndex: 'mode',
    key: 'mode',
  },
  {
    title: '类型',
    width: 120,
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '勘察时间',
    width: 120,
    dataIndex: 'surveyTime',
    key: 'surveyTime',
    render: (text: any, record: any) => {
      return record.surveyTime ? moment(record.surveyTime).format('YYYY-MM-DD') : '-'
    },
  },

  {
    title: '备注',
    width: 180,
    dataIndex: 'remark',
    key: 'remark',
  },
]
export const HouseholdTable: FC<HouseholdTableProps> = (props) => {
  const { data, loading } = props

  return (
    <Table
      columns={columns}
      bordered
      size="middle"
      loading={loading}
      rowKey="key"
      pagination={false}
      dataSource={data}
      //   scroll={{ x: 1400, y: 1000 }}
    />
  )
}
