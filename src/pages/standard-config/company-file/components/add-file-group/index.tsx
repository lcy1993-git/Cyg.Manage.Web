import React from 'react'
import { Input } from 'antd'
import CyFormItem from '@/components/cy-form-item'

const FileGroupForm: React.FC = () => {
  return (
    <>
      <CyFormItem
        label="公司文件组名称"
        name="name"
        required
        labelWidth={115}
        align="right"
        rules={[
          { max: 12, message: '公司文件组名称超出字符数限制，限制为12个字符' },
          { required: true, message: '公司文件组名称不能为空' },
        ]}
      >
        <Input placeholder="请输入公司文件组名称" />
      </CyFormItem>

      <CyFormItem label="备注" name="describe" labelWidth={115} align="right">
        <Input.TextArea showCount maxLength={100} placeholder="请输入备注信息" />
      </CyFormItem>
    </>
  )
}

export default FileGroupForm
