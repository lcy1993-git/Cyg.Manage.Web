import EditFormTable from '@/components/edit-form-table'
import EnumSelect from '@/components/enum-select'
import { getComponentName, getMaterialName } from '@/services/resource-config/component'
import { useRequest } from 'ahooks'
import { Input } from 'antd'
import { isArray } from 'lodash'
import React, { useMemo } from 'react'
import NameSelect from './name-select'
import SpecificationsSelect from './specifications-select'

interface AddDetailParams {
  resourceLibId: string
  addForm: any
}

enum componentType {
  '物料',
  '组件',
}

const AddComponentDetail: React.FC<AddDetailParams> = (props) => {
  const { resourceLibId, addForm } = props

  const { data: materialNameData } = useRequest(() => getMaterialName(resourceLibId), {
    ready: !!resourceLibId,
  })

  const { data: componentNameData } = useRequest(() => getComponentName(resourceLibId), {
    ready: !!resourceLibId,
  })

  const materialNameSelectData = useMemo(() => {
    return materialNameData?.map((item) => {
      return {
        label: item,
        value: item,
      }
    })
  }, [materialNameData])

  const componentSelectData = useMemo(() => {
    return componentNameData?.map((item) => {
      return {
        label: item,
        value: item,
      }
    })
  }, [componentNameData])

  const columns = [
    {
      title: (
        <>
          <span style={{ color: '#e56161' }}>* </span>
          <span>类型</span>
        </>
      ),
      dataIndex: 'type',
      index: 'type',
      width: 240,
      render: (index: number) => (
        <EnumSelect
          bordered={false}
          placeholder="请选择类型"
          enumList={componentType}
          onChange={(value: any) => {
            const formValues = addForm.getFieldValue('items')
            if (isArray(formValues)) {
              const thisValue = formValues[index]
              formValues.splice(index, 1, {
                ...thisValue,
                type: value,
                componentId: undefined,
                specifications: undefined,
                unit: undefined,
              })

              addForm.setFieldsValue({ items: formValues })
            } else {
              addForm.setFieldsValue({
                items: {
                  ...formValues,
                  type: value,
                  componentId: undefined,
                  specifications: undefined,
                  unit: undefined,
                },
              })
            }
          }}
        />
      ),
    },
    {
      title: (
        <>
          <span style={{ color: '#e56161' }}>* </span>
          <span>物料/组件名称</span>
        </>
      ),
      dataIndex: 'componentId',
      index: 'componentId',
      width: 240,
      render: (index: number) => {
        return (
          <NameSelect
            typeEnum={addForm.getFieldValue('items')[index]?.type}
            componentSelectData={componentSelectData}
            materialNameSelectData={materialNameSelectData}
            onChange={(value: any) => {
              const formValues = addForm.getFieldValue('items')
              if (isArray(formValues)) {
                const thisValue = formValues[index]
                formValues.splice(index, 1, {
                  ...thisValue,
                  componentId: value,
                  specifications: undefined,
                  unit: undefined,
                })

                addForm.setFieldsValue({ items: formValues })
              } else {
                addForm.setFieldsValue({
                  items: {
                    ...formValues,
                    componentId: value,
                    specifications: undefined,
                    unit: undefined,
                  },
                })
              }
            }}
          />
        )
      },
    },
    {
      title: (
        <>
          <span style={{ color: '#e56161' }}>* </span>
          <span>物料/组件规格</span>
        </>
      ),
      dataIndex: 'specifications',
      index: 'specifications',
      width: 240,
      render: (index: number) => {
        return (
          <SpecificationsSelect
            onChange={(value: any, option: any) => {
              const formValues = addForm.getFieldValue('items')
              if (isArray(formValues)) {
                const thisValue = formValues[index]
                formValues.splice(index, 1, {
                  ...thisValue,
                  specifications: value,
                  unit: option.unit,
                })

                addForm.setFieldsValue({ items: formValues })
              } else {
                addForm.setFieldsValue({
                  items: {
                    ...formValues,
                    specifications: value,
                    unit: option.unit,
                  },
                })
              }
            }}
            libId={resourceLibId}
            name={addForm.getFieldValue('items')[index]?.componentId}
            typeEnum={addForm.getFieldValue('items')[index]?.type}
          />
        )
      },
    },

    {
      title: (
        <>
          <span style={{ color: '#e56161' }}>* </span>
          <span>数量</span>
        </>
      ),
      dataIndex: 'itemNumber',
      index: 'itemNumber',
      width: 160,
      render: () => {
        return <Input type="number" min={1} placeholder="请输入数量（正整数）" bordered={false} />
      },
      rules: [
        { required: true, message: '数量不能为空' },
        { pattern: /^[1-9]\d*$/, message: '请输入正整数' },
      ],
    },
    {
      title: '单位',
      dataIndex: 'unit',
      index: 'unit',
      width: 140,
      render: () => {
        return <Input bordered={false} disabled />
      },
    },
  ]

  return <EditFormTable formName="items" columns={columns}></EditFormTable>
}

export default AddComponentDetail
