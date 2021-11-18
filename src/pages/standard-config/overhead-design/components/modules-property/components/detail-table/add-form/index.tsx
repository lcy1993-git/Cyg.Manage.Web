import EditFormTable from '@/components/edit-form-table'
import EnumSelect from '@/components/enum-select'
import NameSelect from '@/pages/standard-config/component/components/detail-table/add-form/name-select'
import SpecificationsSelect from '@/pages/standard-config/component/components/detail-table/add-form/specifications-select'
import { getComponentName, getMaterialName } from '@/services/resource-config/component'
import { useRequest } from 'ahooks'
import { Input } from 'antd'
import { isArray } from 'lodash'
import React, { useMemo } from 'react'
import UrlSelect from '@/components/url-select'

interface AddDetailParams {
  resourceLibId: string
  addForm: any
}

enum componentType {
  '物料',
  '组件',
}

const AddModuleDetailTable: React.FC<AddDetailParams> = (props) => {
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
      width: 180,
      rules: [{ required: true, message: '类型不能为空' }],
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
      rules: [{ required: true, message: '规格不能为空' }],
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
      title: (
        <>
          <span style={{ color: '#e56161' }}>* </span>
          <span>所属部件</span>
        </>
      ),
      dataIndex: 'part',
      index: 'part',
      rules: [{ required: true, message: '所属部件不能为空' }],
      width: 180,
      render: () => {
        return (
          <UrlSelect
            bordered={false}
            requestSource="resource"
            url="/ModulesDetails/GetParts"
            valuekey="value"
            titlekey="key"
            allowClear
            placeholder="请选择所属部件"
          />
        )
      },
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

export default AddModuleDetailTable
