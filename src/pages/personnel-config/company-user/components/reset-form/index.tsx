import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';

import rules from '../rule';

const ResetPasswordForm: React.FC = () => {
  return (
    <>
      <CyFormItem label="新密码" name="pwd" required rules={rules.pwd} hasFeedback>
        <Input type="password" placeholder="请输入密码" />
      </CyFormItem>

      <CyFormItem
        label="确认密码"
        name="confirmPwd"
        required
        hasFeedback
        dependencies={['pwd']}
        rules={[
          {
            required: true,
            message: '请确认密码',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('pwd') === value) {
                return Promise.resolve();
              }
              return Promise.reject('两次密码输入不一致，请确认');
            },
          }),
        ]}
      >
        <Input type="password" placeholder="请再次输入密码" onPaste={(e) => e.preventDefault()}/>
      </CyFormItem>
    </>
  );
};

export default ResetPasswordForm;
