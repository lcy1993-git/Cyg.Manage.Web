import React from 'react'
import { Input } from 'antd'
import FormSwitch from '@/components/form-switch'
import CyFormItem from '@/components/cy-form-item'
import DateFormItem from '@/components/date-from-item'
interface IForm {
  type?: 'add' | 'edit'
  selectList?: number[]
}
const DictionaryForm: React.FC<IForm> = () => {
  return (
    <>
      <CyFormItem
        label="模板名称"
        name="name"
        required
        rules={[{ required: true, message: '模板名称不能为空' }]}
      >
        <Input placeholder="请输入模板名称" />
      </CyFormItem>
      <CyFormItem
        label="发布时间"
        name="publishDate"
        required
        rules={[{ required: true, message: '发布时间不能为空' }]}
      >
        <DateFormItem />
      </CyFormItem>
      <CyFormItem
        label="发布单位"
        name="publishedBy"
        required
        rules={[{ required: true, message: '编号发布单位不能为空' }]}
      >
        <Input placeholder="请输入编号发布单位" />
      </CyFormItem>
      <CyFormItem label="备注" name="remark">
        <Input.TextArea rows={3} />
      </CyFormItem>
      <CyFormItem label="状态" name="enabled" required>
        <FormSwitch />
      </CyFormItem>
    </>
  )
}

export default DictionaryForm
