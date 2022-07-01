import { getAdditionalDetails } from '@/services/visualization-results/visualization-results'
import { useRequest } from 'ahooks'
import { Table } from 'antd'
import { FC, useState } from 'react'

export interface AdditionMaterialProps {
  data?: any[]
  //   loading: boolean
  libId: string
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

export const columns = [
  {
    title: '分类',
    width: 120,
    dataIndex: 'materialType',
    key: 'materialType',
  },
  {
    title: '名称',
    width: 180,
    dataIndex: 'materialName',
    key: 'materialName',
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
    render: (text: any, record: any) => {
      return stateMenu[record.state]
    },
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
    render: (text: any, record: any) => {
      return kvEnum[record.kvLevel]
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
]
export const AdditionMaterialTable: FC<AdditionMaterialProps> = (props) => {
  const { data, libId } = props
  const [handleData, setHandleData] = useState<any>([])
  const materialIds = data?.map((item: any) => item.materialId)
  const { data: detailsData, loading } = useRequest(
    () => getAdditionalDetails({ materialIds: materialIds, resourceLibID: libId }),
    {
      onSuccess: () => {
        setHandleData(
          data?.map((item: any) => {
            const findValue = detailsData?.content.find(
              (ite: any) => ite.materialID === item.materialId
            )
            return { ...item, ...findValue }
          })
        )
      },
    }
  )

  return (
    <Table
      columns={columns}
      bordered
      size="middle"
      loading={loading}
      rowKey="key"
      pagination={false}
      dataSource={handleData}
      scroll={{ x: 1600 }}
    />
  )
}
