import React from 'react';
import { Input, message } from 'antd';
import CyFormItem from '@/components/cy-form-item';

import FormSwitch from '@/components/form-switch';

const { TextArea } = Input;

const RolePermissionsForm: React.FC = () => {
  return (
    <>
      <CyFormItem
        label="角色名称"
        name="name"
        required
        rules={[
          { required: true, message: '角色名称不能为空' },
          {
            max: 12,
            message: '角色名称超出字符数限制，限制为12个字符',
          },
        ]}
      >
        <Input placeholder="请输入角色名称" />
      </CyFormItem>
      <CyFormItem label="是否禁用" name="isDisable">
        <FormSwitch />
      </CyFormItem>

      <CyFormItem label="备注" name="remark">
        <TextArea placeholder="请输入备注" showCount maxLength={100} />
      </CyFormItem>
      
    </>
  );
};

export default RolePermissionsForm;
