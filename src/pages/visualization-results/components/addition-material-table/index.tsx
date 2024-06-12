import { Spin, Table } from 'antd'
import { FC } from 'react'

export interface AdditionMaterialProps {
  data?: any[]
  loading?: boolean
  libId?: string
}

//@ts-ignore
// const { companyId } = JSON.parse(localStorage.getItem('userInfo'))
// const stateMenu = {
//   0: '无',
//   1: '原有',
//   2: '新建',
//   3: '利旧',
//   4: '拆除',
// }

// const kvEnum = {
//   0: '无',
//   1: '220V',
//   2: '380V',
//   3: '10kV',
// }

export const columns = [
  {
    title: '分类',
    width: 120,
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '名称',
    width: 180,
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '规格型号',
    width: 260,
    dataIndex: 'spec',
    key: 'spec',
  },
  {
    title: '单位',
    width: 80,
    dataIndex: 'unit',
    key: 'unit',
  },
  {
    title: '数量',
    width: 80,
    dataIndex: 'itemNumber',
    key: 'itemNumber',
    // render: (text: any, record: any) => {
    //   return record.unit === 'km' ? record.itemNumber / 1000 : record.itemNumber
    // },
  },
  {
    title: '单重(kg)',
    width: 80,
    dataIndex: 'pieceWeight',
    key: 'pieceWeight',
  },
  {
    title: '单价(元)',
    width: 80,
    dataIndex: 'unitPrice',
    key: 'unitPrice',
  },
  {
    title: '供给方',
    width: 100,
    dataIndex: 'supplySide',
    key: 'supplySide',
  },
  {
    title: '状态',
    width: 100,
    dataIndex: 'state',
    key: 'state',
    // render: (text: any, record: any) => {
    //   return stateMenu[record.state]
    // },
  },
  {
    title: '物资编号',
    width: 150,
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '电压等级',
    width: 120,
    dataIndex: 'kvLevel',
    key: 'kvLevel',
    // render: (text: any, record: any) => {
    //   return kvEnum[record.kvLevel]
    // },
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
]

export const AdditionMaterialTable: FC<AdditionMaterialProps> = (props) => {
  const { data, loading } = props

  return (
    <Spin spinning={loading} tip="数据请求中...">
      <Table
        columns={columns}
        bordered
        size="middle"
        rowKey="id"
        pagination={false}
        dataSource={data}
        scroll={{ x: 1600, y: 590 }}
      />
    </Spin>
  )
}
