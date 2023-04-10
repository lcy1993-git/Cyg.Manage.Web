import React from 'react'
import { Input } from 'antd'
import CyFormItem from '@/components/cy-form-item'

import FormSwitch from '@/components/form-switch'

interface DictionaryFormItem {
  parentName?: string
}

const DictionaryForm: React.FC<DictionaryFormItem> = (props) => {
  const { parentName } = props

  return (
    <>
      <CyFormItem label="所属层级" name="name">
        <span>{parentName}</span>
      </CyFormItem>

      <CyFormItem label="键" name="key" required>
        <Input placeholder="请输入键" />
      </CyFormItem>

      <CyFormItem label="值" name="value">
        <Input placeholder="请输入键" />
      </CyFormItem>

      <CyFormItem label="扩展列" name="extensionColumn">
        <Input placeholder="请输入扩展列" />
      </CyFormItem>

      <CyFormItem label="排序" name="sort">
        <Input placeholder="请输入排序码" />
      </CyFormItem>

      <CyFormItem label="是否禁用" name="isDisable">
        <FormSwitch />
      </CyFormItem>

      <CyFormItem label="备注" name="remark">
        <Input placeholder="请输入备注信息" />
      </CyFormItem>
    </>
  )
}

export default DictionaryForm
