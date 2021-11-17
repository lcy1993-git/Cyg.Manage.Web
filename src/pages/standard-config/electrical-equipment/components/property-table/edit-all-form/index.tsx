import React from 'react'
import { Form, Input } from 'antd'
import EditPropertyTable from '../edit-property-table'
import { isArray } from '@umijs/deps/compiled/lodash'

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
        return <Input disabled bordered={false} />
      },
    },
    {
      title: '属性值',
      dataIndex: 'propertyValue',
      index: 'propertyValue',
      render: () => {
        return (
          <Input
            placeholder="--请输入属性值--"
            onChange={(e) => {
              // const formValues = editForm.getFieldValue('items')
              console.log(e)
            }}
          />
        )
      },
    },
  ]

  return (
    <EditPropertyTable formName="items" columns={columns} formData={formData}></EditPropertyTable>
  )
}

export default EditAllPropertyForm
