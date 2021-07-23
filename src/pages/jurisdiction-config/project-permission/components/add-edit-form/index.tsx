import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';

const { TextArea } = Input;

const ProjectPermissionForm: React.FC = () => {
  return (
    <>
      <CyFormItem
        label="权限组名称"
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
        <Input placeholder="请输入权限组名称" style={{ width: '1014px', marginRight: '30px' }} />
      </CyFormItem>

      <CyFormItem label="备注" name="remark">
        <TextArea placeholder="请输入备注" showCount maxLength={100} style={{ width: '1014px' }} />
      </CyFormItem>
    </>
  );
};

export default ProjectPermissionForm;
