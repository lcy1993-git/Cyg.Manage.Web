import EditFormTable from '@/components/edit-form-table'
import EnumSelect from '@/components/enum-select'
import NameSelect from '@/pages/standard-config/component/components/detail-table/add-form/name-select'
import SpecificationsSelect from '@/pages/standard-config/component/components/detail-table/add-form/specifications-select'
import { getComponentName, getMaterialName } from '@/services/resource-config/component'
import { useRequest } from 'ahooks'
import { Input } from 'antd'
import { isArray } from 'lodash'
import React, { useMemo } from 'react'

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
      dataIndex: 'itemType',
      index: 'itemType',
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
                itemType: value,
                componentId: undefined,
                itemId: undefined,
                unit: undefined,
              })

              addForm.setFieldsValue({ items: formValues })
            } else {
              addForm.setFieldsValue({
                items: {
                  ...formValues,
                  itemType: value,
                  componentId: undefined,
                  itemId: undefined,
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
            typeEnum={addForm.getFieldValue('items')[index]?.itemType}
            componentSelectData={componentSelectData}
            materialNameSelectData={materialNameSelectData}
            onChange={(value: any, option: any) => {
              const formValues = addForm.getFieldValue('items')
              if (isArray(formValues)) {
                const thisValue = formValues[index]
                formValues.splice(index, 1, {
                  ...thisValue,
                  itemId: undefined,
                  unit: undefined,
                })

                addForm.setFieldsValue({ items: formValues })
              } else {
                addForm.setFieldsValue({
                  items: {
                    ...formValues,
                    itemId: undefined,
                    unit: undefined,
                  },
                })
              }
            }}
          />
        )
      },
      rules: [{ required: true, message: '物料/组件名称不能为空' }],
    },
    {
      title: (
        <>
          <span style={{ color: '#e56161' }}>* </span>
          <span>物料/组件规格</span>
        </>
      ),
      dataIndex: 'itemId',
      index: 'itemId',
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
                  unit: option.unit,
                })

                addForm.setFieldsValue({ items: formValues })
              } else {
                addForm.setFieldsValue({
                  items: {
                    ...formValues,
                    unit: option.unit,
                  },
                })
              }
            }}
            libId={resourceLibId}
            name={addForm.getFieldValue('items')[index]?.componentId}
            typeEnum={addForm.getFieldValue('items')[index]?.itemType}
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
        return <Input type="number" min={1} placeholder="请输入数量" bordered={false} />
      },
      rules: [
        { required: true, message: '数量不能为空' },
        {
          pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/, //匹配正整数
          message: '输入值必须大于0',
        },

        {
          pattern: /^([\-]?[0-9]+[\d]*(.[0-9]{1,3})?)$/, //匹配小数位数
          message: '最多保留三位小数',
        },
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
