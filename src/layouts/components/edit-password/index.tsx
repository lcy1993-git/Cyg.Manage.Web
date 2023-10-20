import CyFormItem from '@/components/cy-form-item'
import { editPassword } from '@/services/user/user-info'
import { handleSM2Crypto, noAutoCompletePassword, uploadAuditLog } from '@/utils/utils'
import { useControllableValue } from 'ahooks'
import { Form, Input, message, Modal } from 'antd'
import { Dispatch, SetStateAction } from 'react'
import { history } from 'umi'
import { baseUrl } from '@/services/common'

interface EditPasswordProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
}
const userInfo = JSON.parse(localStorage.getItem('userInfo') || '')
const EditPassword = (props: EditPasswordProps) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })

  const [form] = Form.useForm()

  const sureEditPassword = () => {
    form.validateFields().then(async (value) => {
      const { pwd, newPwd } = value
      try {
        await editPassword({ oldPwd: handleSM2Crypto(pwd), newPwd: handleSM2Crypto(newPwd) })

        uploadAuditLog(
          [
            {
              auditType: 1,
              eventType: 4,
              operationDataId: userInfo.userName,
              operationDataName: userInfo.name,
              eventDetailType: '账号密码修改',
              executionResult: '成功',
              auditLevel: 2,
              serviceAdress: `${baseUrl.project}/CompanyUser/ResetPwd`,
            },
          ],
          true
        )
        setState(false)
        message.info('密码已经修改,请重新登录')
        localStorage.removeItem('Authorization')
        history.push('/again-login')
        setTimeout(() => {
          localStorage.setItem('Authorization', '')
        }, 100)
      } catch (e) {
        uploadAuditLog([
          {
            auditType: 1,
            eventType: 4,
            operationDataId: userInfo.id,
            operationDataName: userInfo.userName,
            eventDetailType: '账号密码修改',
            executionResult: '失败',
            auditLevel: 2,
            serviceAdress: `${baseUrl.project}/CompanyUser/ResetPwd`,
          },
        ])
      }
    })
  }

  return (
    <Modal
      maskClosable={false}
      title="修改密码"
      visible={state as boolean}
      destroyOnClose
      okText="确定"
      cancelText="取消"
      onCancel={() => setState(false)}
      onOk={() => sureEditPassword()}
    >
      <Form form={form} preserve={false}>
        <CyFormItem
          name="pwd"
          label="原密码"
          required
          labelWidth={100}
          hasFeedback
          rules={[
            {
              required: true,
              message: '请输入原密码',
            },
          ]}
        >
          <Input
            type="password"
            {...noAutoCompletePassword}
            placeholder="请输入"
            onPaste={(e) => e.preventDefault()}
          />
        </CyFormItem>
        <CyFormItem
          name="newPwd"
          label="新密码"
          required
          labelWidth={100}
          hasFeedback
          rules={[
            { required: true, message: '密码不能为空' },
            {
              pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9@#$%^&*+=!]{8,20}$/,
              message: '密码必须由(8-20)位数字和大小写字母组成（可包含特殊字符）',
            },
          ]}
        >
          <Input
            type="password"
            {...noAutoCompletePassword}
            placeholder="请输入"
            onPaste={(e) => e.preventDefault()}
          />
        </CyFormItem>
        <CyFormItem
          name="confirmPassword"
          label="确认密码"
          required
          labelWidth={100}
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
          <Input
            type="password"
            {...noAutoCompletePassword}
            placeholder="请输入"
            onPaste={(e) => e.preventDefault()}
          />
        </CyFormItem>
      </Form>
    </Modal>
  )
}

export default EditPassword
