import { Table } from 'antd'

interface Props {
  data: { materialList: any[]; componentList: any[] }
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
      dataIndex: 'itemName',
      index: 'itemName',
      title: '物料/组件名称',
      width: 450,
    },

    {
      dataIndex: getSpecKey(type),
      index: getSpecKey(type),
      title: '物料/组件型号',
      width: 350,
    },

    {
      dataIndex: 'itemNumber',
      index: 'itemNumber',
      title: '数量',
      width: 150,
      editable: true,
    },
    {
      dataIndex: 'isComponent',
      index: 'isComponent',
      title: '是否组件',
      width: 220,
      render: (text: any, record: any) => {
        return record.isComponent === 1 ? '是' : '否'
      },
    },
  ]

  //   const dataSource = data.materialList.concat(data.componentList)
  const dataSource = data.materialList

  return (
    <Table
      columns={columns}
      dataSource={dataSource || []}
      rowKey="id"
      pagination={false}
      bordered={true}
    />
  )
}

export default ComponentDetail
