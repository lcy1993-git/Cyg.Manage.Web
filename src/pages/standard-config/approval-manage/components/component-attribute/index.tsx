import { Table } from 'antd'

interface Props {
  data: { componentPropertyList: any[] }
}

const ComponentAttribute: React.FC<Props> = (props) => {
  const { data } = props

  const columns = [
    {
      dataIndex: 'propertyName',
      index: 'propertyName',
      title: '属性名称',
      width: 280,
    },
    {
      dataIndex: 'propertyValue',
      index: 'propertyValue',
      title: '属性值',
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={data.componentPropertyList || []}
      rowKey="propertyName"
      pagination={false}
      bordered={true}
    />
  )
}

export default ComponentAttribute
