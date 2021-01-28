import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import EnumRadio from '@/components/enum-radio';
import { BelongModuleEnum } from '@/services/jurisdiction-config/role-manage';

import rules from './rule';

interface RoleManageForm {
  type?: 'add' | 'edit';
}

const RoleManageForm: React.FC<RoleManageForm> = (props) => {
  const { type = 'edit' } = props;
  return (
    <>
      <CyFormItem label="角色名称" name="roleName" required rules={rules.roleName}>
        <Input placeholder="请输入角色名" />
      </CyFormItem>

      {type === 'add' && (
        <CyFormItem label="角色类型" name="roleType" required>
          <EnumRadio enumList={BelongModuleEnum} />
        </CyFormItem>
      )}

      <CyFormItem label="备注" name="remark">
        <Input placeholder="请输入备注" />
      </CyFormItem>
    </>
  );
};

export default RoleManageForm;
