import { Table } from 'antd'

interface Props {
  data: { MaterialList: any[]; ComponentList: any[] }
  type: string
}
const getSpecKey = (type: string) => {
  if (type === 'component') {
    return 'spec'
  }
  return 'itemSpec'
}
const ComponentDetail: React.FC<Props> = (props) => {
  const { data, type } = props

  const columns = [
    {
      dataIndex: 'ItemName',
      index: 'ItemName',
      title: '物料/组件名称',
      width: 450,
      render: (text: any, record: any) => {
        return record.ComponentType ? record.ComponentName : record.MaterialName
      },
    },

    {
      dataIndex: getSpecKey(type),
      index: getSpecKey(type),
      title: '物料/组件型号',
      width: 350,
      render: (text: any, record: any) => {
        return record.ComponentType ? record.ComponentSpec : record.Spec
      },
    },

    {
      dataIndex: 'ItemNumber',
      index: 'ItemNumber',
      title: '数量',
      width: 150,
      editable: true,
    },
    {
      dataIndex: 'IsComponent',
      index: 'IsComponent',
      title: '是否组件',
      width: 220,
      render: (text: any, record: any) => {
        return record.ComponentType ? '是' : '否'
      },
    },
  ]
  const materialList = data?.MaterialList || []
  const componentList = data?.ComponentList || []

  const dataSource = materialList.concat(componentList)

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      pagination={false}
      bordered={true}
    />
  )
}

export default ComponentDetail
