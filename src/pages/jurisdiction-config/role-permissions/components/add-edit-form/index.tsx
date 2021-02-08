import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';

import FormSwitch from '@/components/form-switch';

const RolePermissionsForm: React.FC = () => {
  return (
    <>
      <CyFormItem label="角色名称" name="name" required>
        <Input placeholder="请输入角色名称" />
      </CyFormItem>
      <CyFormItem label="是否禁用" name="isDisable">
        <FormSwitch />
      </CyFormItem>

      <CyFormItem label="备注" name="remark">
        <Input placeholder="请输入备注信息" />
      </CyFormItem>
    </>
  );
};

export default RolePermissionsForm;
