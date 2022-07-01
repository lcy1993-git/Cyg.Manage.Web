import React from 'react'
import { Form, Input, Spin } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import UrlSelect from '@/components/url-select'

interface SubStationPowerParams {
  currentEditTab: string
}

const SubStationPowerForm: React.FC<SubStationPowerParams> = (props) => {
  const { currentEditTab } = props

  return (
    <Form>
      <CyFormItem name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
        <Input placeholder="请输入名称" />
      </CyFormItem>
      <CyFormItem
        label="电压等级"
        name="kvLevel"
        required
        rules={[{ required: true, message: '电压等级不能为空' }]}
      >
        <Input placeholder="请输入电压等级" />
      </CyFormItem>

      <CyFormItem label="设计规模" name="designScaleMainTransformer">
        <Input placeholder="请输入设计规模" />
      </CyFormItem>
      <CyFormItem label="已建规模" name="builtScaleMainTransformer">
        <Input placeholder="请输入设计规模" />
      </CyFormItem>

      <CyFormItem label="主接线方式" name="mainWiringMode">
        <Input placeholder="请输入主接线方式" />
      </CyFormItem>
      <CyFormItem label="经度" name="lng">
        <Input placeholder="请输入经度" />
      </CyFormItem>
      <CyFormItem label="纬度" name="lat">
        <Input placeholder="请输入纬度" />
      </CyFormItem>
    </Form>
  )
}

export default SubStationPowerForm
