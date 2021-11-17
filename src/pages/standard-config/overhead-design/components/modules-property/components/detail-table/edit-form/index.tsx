import React, { useEffect, useMemo, useState } from 'react'
import { Col, Input, Row } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import Scrollbars from 'react-custom-scrollbars'
import EnumSelect from '@/components/enum-select'
import { useRequest } from 'ahooks'
import { getComponentName, getMaterialName } from '@/services/resource-config/component'
import UrlSelect from '@/components/url-select'
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

const EditModuleDetail: React.FC<EditComponentDetailParams> = (props) => {
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
              label="所属部件"
              name="part"
              required
              labelWidth={130}
              rules={[{ required: true, message: '所属部件不能为空' }]}
            >
              <UrlSelect
                requestSource="resource"
                url="/ModulesDetails/GetParts"
                // style={{ width: 'calc(100% - 16px)' }}
                valuekey="value"
                titlekey="key"
                allowClear
                placeholder="--所属部件--"
              />
            </CyFormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <CyFormItem
              align="right"
              required
              label="物料/组件名称"
              name="componentId"
              labelWidth={113}
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
          <Col span={12}>
            <CyFormItem align="right" label="物料/组件规格" name="itemId" labelWidth={130} required>
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
        </Row>
        <Row>
          <Col span={12}>
            <CyFormItem
              align="right"
              label="数量"
              name="itemNumber"
              labelWidth={113}
              required
              rules={[
                { required: true, message: '数量不能为空' },
                { pattern: /^[1-9]\d*$/, message: '请输入正整数' },
              ]}
            >
              <Input type="number" min={1} placeholder="请输入数量（正整数）" />
            </CyFormItem>
          </Col>
          <Col span={12}>
            <CyFormItem align="right" label="单位" name="unit" labelWidth={130}>
              <Input disabled />
            </CyFormItem>
          </Col>
        </Row>
      </Scrollbars>
    </>
  )
}

export default EditModuleDetail
