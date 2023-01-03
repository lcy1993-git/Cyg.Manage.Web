import { Table } from 'antd'

interface Props {
  data: { ComponentPropertyList: any[] }
}

const ComponentAttribute: React.FC<Props> = (props) => {
  const { data } = props

  const columns = [
    {
      dataIndex: 'PropertyName',
      index: 'PropertyName',
      title: '属性名称',
      width: 280,
    },
    {
      dataIndex: 'PropertyValue',
      index: 'PropertyValue',
      title: '属性值',
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={data.ComponentPropertyList || []}
      rowKey="propertyName"
      pagination={false}
      bordered={true}
    />
  )
}

export default ComponentAttribute
