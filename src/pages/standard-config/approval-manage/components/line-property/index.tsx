import { Table } from 'antd'

interface Props {
  data: { LineProperty: any }
  name: string
}

const LineProperty: React.FC<Props> = (props) => {
  const { data, name } = props

  const columns = [
    {
      title: '物料编码',
      dataIndex: 'MaterialId',
      index: 'MaterialId',
      width: 200,
    },
    {
      title: '物料名称',
      dataIndex: 'MaterialName',
      index: 'MaterialName',
      width: 220,
    },
    {
      title: '截面积(mm²)',
      dataIndex: 'CrossSectionArea',
      index: 'CrossSectionArea',
      width: 220,
    },
    {
      title: '是否可下户',
      dataIndex: 'IsUsedHousehold',
      index: 'IsUsedHousehold',
      width: 220,
      render: (text: any, record: any) => {
        return record.isUsedHousehold === true ? '是' : '否'
      },
    },
  ]
  let obj = data.LineProperty || {}
  let tableData = [{ ...obj, MaterialName: name }]

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      rowKey="id"
      pagination={false}
      bordered={true}
    />
  )
}

export default LineProperty
