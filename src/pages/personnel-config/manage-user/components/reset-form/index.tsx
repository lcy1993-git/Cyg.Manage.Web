import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';

import rules from '../rule';

const ResetPasswordForm: React.FC = () => {
  return (
    <>
      <CyFormItem label="密码" name="pwd" required rules={rules.pwd}>
        <Input type="password" placeholder="请输入密码" />
      </CyFormItem>

      <CyFormItem label="确认密码" name="confirmPwd" required rules={rules.confirmPwd}>
        <Input type="password" placeholder="请再次输入密码" />
      </CyFormItem>
    </>
  );
};

export default ResetPasswordForm;
