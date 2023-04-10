import React, { useMemo } from 'react'
import { Input, TreeSelect } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import FormSwitch from '@/components/form-switch'
import EnumSelect from '@/components/enum-select'
import { BelongModuleEnum, FunctionModuleTreeData } from '@/services/system-config/function-module'

import rules from './rule'

interface FunctionModuleFormProps {
  treeData: FunctionModuleTreeData[]
}

const FunctionModuleForm: React.FC<FunctionModuleFormProps> = (props) => {
  const { treeData = [] } = props

  const mapTreeData = (data: any) => {
    return {
      title: data.text,
      value: data.id,
      children: data.children.map(mapTreeData),
    }
  }

  const handleData = useMemo(() => {
    return treeData.map(mapTreeData)
  }, [JSON.stringify(treeData)])

  return (
    <>
      <CyFormItem label="模块名称" name="name" required rules={rules.name}>
        <Input placeholder="请输入" />
      </CyFormItem>
      <CyFormItem label="所属模块" name="parentId">
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={handleData}
          placeholder="请选择"
          treeDefaultExpandAll
          allowClear
        />
      </CyFormItem>
      <CyFormItem label="类别" name="category" required rules={rules.category}>
        <EnumSelect placeholder="请选择" enumList={BelongModuleEnum} />
      </CyFormItem>
      <CyFormItem label="授权码" name="authCode" required rules={rules.authCode}>
        <Input placeholder="请输入" />
      </CyFormItem>
      <CyFormItem label="路由地址" name="url">
        <Input placeholder="请输入" />
      </CyFormItem>
      <CyFormItem label="排序" name="sort" required rules={rules.sort}>
        <Input placeholder="请输入" />
      </CyFormItem>
      <CyFormItem label="是否禁用" name="isDisable">
        <FormSwitch />
      </CyFormItem>
    </>
  )
}

export default FunctionModuleForm
