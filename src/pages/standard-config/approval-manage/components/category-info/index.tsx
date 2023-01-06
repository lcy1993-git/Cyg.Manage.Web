import { Table } from 'antd'

interface Props {
  data: { PoleType: any }
}

const CategoryInfo: React.FC<Props> = (props) => {
  const { data } = props
  const columns = [
    {
      dataIndex: 'PoleTypeCode',
      index: 'PoleTypeCode',
      title: '分类简号',
      width: 180,
    },
    {
      dataIndex: 'PoleTypeName',
      index: 'PoleTypeName',
      title: '分类名称',
      width: 280,
    },
    {
      dataIndex: 'Category',
      index: 'Category',
      title: '类型',
      width: 200,
    },
    {
      dataIndex: 'KVLevel',
      index: 'KVLevel',
      title: '电压等级',
      width: 180,
    },
    {
      dataIndex: 'Type',
      index: 'Type',
      title: '分类类型',
      width: 180,
    },
    {
      dataIndex: 'Corner',
      index: 'Corner',
      title: '转角',
      width: 180,
    },
    {
      dataIndex: 'Material',
      index: 'Material',
      title: '分类材质',
      width: 180,
    },
    {
      dataIndex: 'LoopNumber',
      index: 'LoopNumber',
      title: '回路数',
      width: 180,
    },

    {
      dataIndex: 'IsTension',
      index: 'IsTension',
      title: '是否耐张',
      width: 180,
      render: (text: any, record: any) => {
        return record.isTension == true ? '是' : '否'
      },
    },
  ]
  let obj = data.PoleType || {}
  let tableData = [obj]

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

export default CategoryInfo
