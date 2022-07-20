import React, { useEffect, useMemo, useState } from 'react'
import { Col, Input, Row } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import Scrollbars from 'react-custom-scrollbars'
import EnumSelect from '@/components/enum-select'
import { useRequest } from 'ahooks'
import { getComponentName, getMaterialName } from '@/services/resource-config/component'
import NameSelect from '@/pages/standard-config/component/components/detail-table/add-form/name-select'
import SpecificationsSelect from '@/pages/standard-config/component/components/detail-table/add-form/specifications-select'

interface EditComponentDetailParams {
  resourceLibId: string
  formData: any
  editForm: any
}

enum componentType {
  '物料',
  '组件',
}

const EditComponentDetail: React.FC<EditComponentDetailParams> = (props) => {
  const { resourceLibId, editForm, formData } = props

  const [type, setType] = useState<string>('')
  const [changeName, setChangeName] = useState<string>('')

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

  useEffect(() => {
    setType(formData?.itemType)
    setChangeName(formData?.componentId)
  }, [formData])

  return (
    <>
      <Scrollbars autoHeight>
        <Row>
          <Col span={12}>
            <CyFormItem align="right" required label="类型" name="itemType" labelWidth={113}>
              <EnumSelect
                placeholder="请选择类型"
                enumList={componentType}
                onChange={(value: any) => {
                  setType(value)
                  editForm.setFieldsValue({
                    itemType: value,
                    componentId: undefined,
                    itemId: undefined,
                    unit: undefined,
                  })
                }}
              />
            </CyFormItem>
          </Col>
          <Col span={12}>
            <CyFormItem
              align="right"
              required
              label="物料/组件名称"
              name="componentId"
              labelWidth={130}
            >
              <NameSelect
                isBorder
                typeEnum={type}
                componentSelectData={componentSelectData}
                materialNameSelectData={materialNameSelectData}
                onChange={(value: any, option: any) => {
                  setChangeName(value)
                  editForm.setFieldsValue({
                    itemId: undefined,
                    unit: undefined,
                  })
                }}
              />
            </CyFormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <CyFormItem align="right" label="物料/组件规格" name="itemId" labelWidth={113} required>
              <SpecificationsSelect
                isBorder
                onChange={(value: any, option: any) => {
                  editForm.setFieldsValue({
                    unit: option.unit,
                  })
                }}
                libId={resourceLibId}
                name={changeName}
                typeEnum={type}
              />
            </CyFormItem>
          </Col>
          <Col span={12}>
            <CyFormItem
              align="right"
              label="数量"
              name="itemNumber"
              labelWidth={130}
              required
              rules={[
                { required: true, message: '数量不能为空' },
                {
                  pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/, //匹配正整数
                  message: '输入值必须大于0',
                },
                {
                  pattern: /^([\-]?[0-9]+[\d]*(.[0-9]{1,3})?)$/, //匹配小数位数
                  message: '最多保留三位小数',
                },
                () => ({
                  validator(_, value) {
                    if (value <= 1000 && value > 0) {
                      return Promise.resolve()
                    }
                    if (value > 1000) {
                      return Promise.reject('请输入0~1000以内的数字')
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <Input type="number" min={1} placeholder="请输入数量" />
            </CyFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <CyFormItem align="right" label="单位" name="unit" labelWidth={113}>
              <Input disabled />
            </CyFormItem>
          </Col>
        </Row>
      </Scrollbars>
    </>
  )
}

export default EditComponentDetail
