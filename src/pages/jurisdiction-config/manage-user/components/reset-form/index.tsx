import React from 'react'
import { Input } from 'antd'
import CyFormItem from '@/components/cy-form-item'

import rules from '../rule'

const ResetPasswordForm: React.FC = () => {
  return (
    <>
      <CyFormItem label="新密码" name="newPwd" required rules={rules.pwd} hasFeedback>
        <Input type="password" autoComplete="new-password" placeholder="请输入密码" />
      </CyFormItem>

      <CyFormItem
        label="确认密码"
        name="confirmPwd"
        required
        hasFeedback
        dependencies={['newPwd']}
        rules={[
          {
            required: true,
            message: '请确认密码',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPwd') === value) {
                return Promise.resolve()
              }
              return Promise.reject('两次密码输入不一致，请确认')
            },
          }),
        ]}
      >
        <Input type="password" autoComplete="new-password" placeholder="请再次输入密码" />
      </CyFormItem>
    </>
  )
}

export default ResetPasswordForm
