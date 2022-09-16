import { Input } from 'antd'
import React from 'react'
import EditPropertyTable from '../edit-property-table'

interface PropertyParams {
  propertyName: string
  propertyValue: string
}

interface EditAllPropertyParams {
  editForm: any
  formData: PropertyParams[]
}
const EditAllPropertyForm: React.FC<EditAllPropertyParams> = (props) => {
  const { editForm, formData } = props
  const columns = [
    {
      title: (
        <>
          <span>属性名称</span>
        </>
      ),
      dataIndex: 'propertyName',
      index: 'propertyName',
      width: 320,
      render: () => {
        // return <Input disabled bordered={false} />
        return <Input placeholder="--请输入属性名--" />
      },
    },
    {
      title: '属性值',
      dataIndex: 'propertyValue',
      index: 'propertyValue',
      render: () => {
        return <Input placeholder="--请输入属性值--" />
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      index: 'operation',
      width: 50,
    },
  ]

  return (
    <EditPropertyTable formName="items" columns={columns} formData={formData}></EditPropertyTable>
  )
}

export default EditAllPropertyForm
