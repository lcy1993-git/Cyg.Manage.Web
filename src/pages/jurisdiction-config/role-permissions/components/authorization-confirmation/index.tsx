import React, { useState } from 'react'
import { Form, Input, Modal } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import { handleSM2Crypto, noAutoCompletePassword } from '@/utils/utils'
import { verifyAuditAdminPwd } from '@/services/personnel-config/company-user'
// import { baseUrl } from '@/services/common'
type Props = {
  authorizationConfirmation: any
  setAuthorizationConfirmation: any
  setIfSuccess: any
  changeItem: {
    id: string
    status: number
  }
}
const AuthorizationConfirmation: React.FC<Props> = ({
  authorizationConfirmation,
  setAuthorizationConfirmation,
  setIfSuccess,
  // changeItem,
}) => {
  const [sureForm] = Form.useForm()
  const [verification, setVerification] = useState<boolean>(true)
  const okButton = () => {
    sureForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          userName: '',
        },
        {
          ...value,
          pwd: handleSM2Crypto(value.pwd),
        }
      )
      try {
        const res = await verifyAuditAdminPwd(submitInfo)
        if (res) {
          setIfSuccess(true)
          setVerification(true)
        } else {
          setVerification(false)
          // uploadAuditLog([
          //   {
          //     auditType: 2,
          //     eventType: 10,
          //     eventDetailType: changeItem.status === 2 ? '资源库禁用' : '资源库启用',
          //     executionResult: '失败',
          //     auditLevel: 2,
          //     serviceAdress: `${baseUrl.project}/Users/VerifyAuditAdminPwd`,
          //   },
          // ])
        }
      } catch (e) {
        // uploadAuditLog([
        //   {
        //     auditType: 2,
        //     eventType: 10,
        //     eventDetailType: changeItem.status === 2 ? '资源库禁用' : '资源库启用',
        //     executionResult: '失败',
        //     auditLevel: 2,
        //     serviceAdress: `${baseUrl.project}/Users/VerifyAuditAdminPwd`,
        //   },
        // ])
      }
    })
  }
  return (
    <>
      <Modal
        maskClosable={false}
        title="授权"
        width="500px"
        visible={authorizationConfirmation}
        okText="确认"
        onCancel={() => setAuthorizationConfirmation(false)}
        onOk={() => okButton()}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={sureForm} preserve={false}>
          <CyFormItem
            label="账号"
            name="userName"
            required
            rules={[{ required: true, message: '账号不能为空' }]}
          >
            <Input placeholder="请输入账号" style={{ width: '100%' }} />
          </CyFormItem>

          <CyFormItem
            label="密码"
            name="pwd"
            required
            rules={[{ required: true, message: '密码不能为空' }]}
          >
            <Input
              placeholder="请输入密码"
              type="password"
              {...noAutoCompletePassword}
              style={{ width: '100%' }}
            />
          </CyFormItem>
        </Form>
        {!verification && <div style={{ color: '#FF2525', marginLeft: '90px' }}>密码输入错误</div>}
        <div style={{ color: '#FF2525', marginTop: '16px' }}>
          注：该操作需审核管理员确认方可生效，请审核管理员输入账号和密码确认
        </div>
      </Modal>
    </>
  )
}

export default AuthorizationConfirmation
