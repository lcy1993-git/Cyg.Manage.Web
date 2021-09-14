import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';

const { TextArea } = Input;

const RolePermissionsForm: React.FC = () => {
  return (
    <>
      <CyFormItem
        label="模板名称"
        name="name"
        required
        rules={[
          { required: true, message: '模板名称不能为空' },
          {
            max: 12,
            message: '模板名称超出字符数限制，限制为12个字符',
          },
        ]}
      >
        <Input placeholder="请输入模板名称" style={{ width: '100%' }} />
      </CyFormItem>

      <CyFormItem label="备注" name="remark">
        <TextArea placeholder="请输入备注" showCount maxLength={100} style={{ width: '100%' }} />
      </CyFormItem>
    </>
  );
};

export default RolePermissionsForm;
