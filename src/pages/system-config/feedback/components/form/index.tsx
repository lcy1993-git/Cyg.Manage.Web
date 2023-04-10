import React from 'react'
import { Input } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import EnumSelect from '@/components/enum-select'
import { CategoryEnum } from '@/services/personnel-config/feedback'
import rules from './rule'

const UserFeedBackForm: React.FC = () => {
  return (
    <>
      <CyFormItem label="类别" name="category" required rules={rules.category}>
        <EnumSelect enumList={CategoryEnum} placeholder="请选择反馈类别" />
      </CyFormItem>

      <CyFormItem label="标题" name="title" required rules={rules.title}>
        <Input placeholder="请输入反馈标题" />
      </CyFormItem>

      <CyFormItem label="联系电话" name="phone">
        <Input placeholder="请输入联系电话" />
      </CyFormItem>

      <CyFormItem label="描述" name="describe">
        <Input.TextArea placeholder="请输入问题描述" />
      </CyFormItem>
    </>
  )
}

export default UserFeedBackForm
