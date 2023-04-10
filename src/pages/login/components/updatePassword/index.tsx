import React, { Dispatch, SetStateAction } from 'react'
import { Button, Form, Input, message, Space } from 'antd'

import styles from './index.less'
import { modifyPwdByUserName } from '@/services/login'
import { uploadAuditLog } from '@/utils/utils'
import { baseUrl } from '@/services/common'

export type LoginType = 'account' | 'phone'
interface Props {
  updatePwd: Dispatch<SetStateAction<boolean>>
  userName: string
}
const UpdatePassword: React.FC<Props> = (props) => {
  const { updatePwd, userName } = props
  const [form] = Form.useForm()
  const onFinish = async (values: any) => {
    values.userName = userName
    if (values.newPwd !== values.confirmPwd) {
      message.error('两次输入的新密码不一致,请重新输入!')
      return
    }
    await modifyPwdByUserName(values)
    uploadAuditLog(
      [
        {
          auditType: 1,
          eventType: 4,
          operationDataId: values.userName,
          operationDataName: values.name,
          eventDetailType: '账号密码修改',
          executionResult: '成功',
          auditLevel: 2,
          serviceAdress: `${baseUrl.project}/CompanyUser/ResetPwd`,
        },
      ],
      true
    )
    updatePwd(false)
  }

  return (
    <Form form={form}>
      <div className={styles.updatePwd}>
        <div className={styles.updateForm}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            form={form}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            {/*<Form.Item*/}
            {/*  label="用户名"*/}
            {/*  name="userName"*/}
            {/*  rules={[{ required: true, message: '请输入用户名!' }]}*/}
            {/*>*/}
            {/*  <Input className={styles.loginInput} />*/}
            {/*</Form.Item>*/}
            <Form.Item
              label="旧密码"
              name="oldPwd"
              rules={[{ required: true, message: '请输入旧密码!' }]}
            >
              <Input.Password className={styles.loginInput} visibilityToggle={false} />
            </Form.Item>

            <Form.Item
              label="新密码"
              name="newPwd"
              rules={[{ required: true, message: '请输入新密码!' }]}
            >
              <Input.Password className={styles.loginInput} visibilityToggle={false} />
            </Form.Item>

            <Form.Item
              label="确认新密码"
              name="confirmPwd"
              rules={[{ required: true, message: '请再次输入新密码!' }]}
            >
              <Input.Password className={styles.loginInput} visibilityToggle={false} />
            </Form.Item>
          </Form>
        </div>
        <div className={styles.buttons}>
          <Space>
            <Button type="primary" htmlType="submit" className={styles.loginButton}>
              提交
            </Button>
            <Button className={styles.loginButton} onClick={() => updatePwd(false)}>
              取消
            </Button>
          </Space>
        </div>
      </div>
    </Form>
  )
}

export default UpdatePassword
