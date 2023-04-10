import React from 'react'
import { Input } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import EnumRadio from '@/components/enum-radio'
import { BelongModuleEnum } from '@/services/jurisdiction-config/role-manage'

interface RoleManageForm {
  type?: 'add' | 'edit'
}
const { TextArea } = Input

const RoleManageForm: React.FC<RoleManageForm> = (props) => {
  const { type = 'edit' } = props
  return (
    <>
      <CyFormItem
        label="角色名称"
        name="roleName"
        required
        rules={[
          { required: true, message: '角色名称不能为空' },
          { max: 12, message: '角色名称超出字符数限制，限制为12个字符' },
        ]}
      >
        <Input placeholder="请输入角色名" />
      </CyFormItem>

      {type === 'add' && (
        <CyFormItem label="角色类型" name="roleType" required>
          <EnumRadio enumList={BelongModuleEnum} />
        </CyFormItem>
      )}

      <CyFormItem label="备注" name="remark">
        <TextArea placeholder="请输入备注" showCount maxLength={100} />
      </CyFormItem>
    </>
  )
}

export default RoleManageForm
