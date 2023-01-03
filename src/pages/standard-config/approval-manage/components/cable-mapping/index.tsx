import { Table } from 'antd'
import { useMemo } from 'react'

interface Props {
  data: { CableHeadOutside: object; CableHeadInside: object; CableHeadMiddle: object }
}

const CableMapping: React.FC<Props> = (props) => {
  const { data } = props

  const columns = [
    {
      title: '电缆物料编码',
      dataIndex: 'LineMaterialID',
      index: 'LineMaterialID',
      width: 200,
    },
    {
      title: '物料名称',
      dataIndex: 'LineMaterialName',
      index: 'LineMaterialName',
      width: 220,
    },
    {
      title: '规格型号',
      dataIndex: 'LineMaterialSpec',
      index: 'LineMaterialSpec',
      width: 220,
    },
    {
      title: '电缆终端物料编码',
      dataIndex: 'HeadMaterialID',
      index: 'HeadMaterialID',
      width: 220,
    },
    {
      title: '物料名称',
      dataIndex: 'HeadMaterialName',
      index: 'HeadMaterialName',
      width: 240,
    },
    {
      title: '规格型号',
      dataIndex: 'HeadMaterialSpec',
      index: 'HeadMaterialSpec',
      width: 240,
    },
    {
      title: '是否可下户',
      dataIndex: 'IsOutDoors',
      index: 'IsOutDoors',
      width: 180,
    },
  ]

  const dataSource = useMemo(() => {
    const tableData = []
    data.CableHeadOutside && tableData.push(data.CableHeadOutside)
    data.CableHeadInside && tableData.push(data.CableHeadInside)
    data.CableHeadMiddle && tableData.push(data.CableHeadMiddle)
    return tableData
  }, [JSON.stringify(data)])

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

export default CableMapping
