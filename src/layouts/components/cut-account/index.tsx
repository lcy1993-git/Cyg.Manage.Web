import CyFormItem from '@/components/cy-form-item'
import {
  getAuthorityModules,
  GetCommonUserInfo,
  // getUserInfoRequest,
  // qgcLoginRequest,
  userLoginRequest,
} from '@/services/login'
import { useGetUserInfo } from '@/utils/hooks'
import { flatten, noAutoCompletePassword, uploadAuditLog } from '@/utils/utils'
import { useControllableValue } from 'ahooks'
import { Button, Form, Input, message, Modal } from 'antd'
import { Dispatch, useEffect, useState } from 'react'
import { SetStateAction } from 'react'

import { history } from 'umi'
import VerifycodeImage from '@/pages/login/components/verifycode-image'
import { baseUrl } from '@/services/common'
import { useLayoutStore } from '@/layouts/context'

interface EditPasswordProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  againLogin?: boolean
  finishEvent?: () => void
}

const CutAccount = (props: EditPasswordProps) => {
  const { clearWs } = useLayoutStore()
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { againLogin = false, finishEvent } = props
  const [form] = Form.useForm()
  const [spinning, setSpinning] = useState<boolean>(false)
  const [imageCode, setImageCode] = useState<string>('')
  // 刷新验证码的hash值
  const random = () => Math.random().toString(36).slice(2)
  const [reloadSign, setReloadSign] = useState(random())
  const refreshCode = () => setReloadSign(random())
  // 是否验证码错误
  const [hasErr, setHasErr] = useState(false)
  const sureCutAccount = () => {
    setSpinning(true)
    form
      .validateFields()
      .then(async (value) => {
        const { userName } = value
        value.code = imageCode
        // TODO 快捷切换
        const resData = await userLoginRequest(value)
        if (resData && resData.accessToken) {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const lastAccount = useGetUserInfo()

          const isLastAccount = lastAccount && lastAccount.userName === userName
          // @ts-ignore
          const { accessToken } = resData

          localStorage.setItem('Authorization', accessToken)

          const userInfo = await GetCommonUserInfo()
          const modules = await getAuthorityModules()
          uploadAuditLog([
            {
              auditType: 1,
              eventType: 1,
              eventDetailType: '登录',
              executionResult: '成功',
              auditLevel: 2,
              serviceAdress: `${baseUrl.common}/Users/SignIn`,
            },
          ])
          const buttonModules = flatten(modules)
          const buttonArray = buttonModules
            .filter((item: any) => item.category === 3)
            .map((item: any) => item.authCode)

          localStorage.setItem('functionModules', JSON.stringify(modules))
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
          localStorage.setItem('buttonJurisdictionArray', JSON.stringify(buttonArray))

          if (!againLogin || !isLastAccount) {
            setState(false)
            message.success('账户快捷登录成功')
            if (userInfo?.adminCategory === 1 && userInfo?.userType === 4) {
              // 是审计管理员
              localStorage.setItem('isAdminCategory', '0')
              history.push('/admin-index/home')
            } else {
              history.push('/index')
              localStorage.removeItem('isAdminCategory')
            }
            // eslint-disable-next-line no-restricted-globals
            location.reload()
            setSpinning(false)
          } else {
            finishEvent?.()
            //history.go(-1);
            setSpinning(false)
            setState(false)
          }
        } else if (resData.code === 40100) {
          // 临时关闭验证码，开启时，打开下行代码
          // setNeedVerifycode(true);
          message.error(resData.message)
          loginField()
          setSpinning(false)
        } else if (resData.code === 40201) {
          history.push('/index')
          message.error(resData.message)
          setSpinning(false)
        } else if (resData.code === 40202) {
          message.error(resData.message)
          loginField()
          refreshCode()
          setSpinning(false)
        } else if (resData.code === 40200) {
          refreshCode()
          loginField()
          message.warning(resData.message)
          setSpinning(false)
        } else {
          loginField()
          refreshCode()
          message.warning(resData.message)
          setSpinning(false)
        }
        // 如果这次登录的账号跟之前的不一样，那么就只到首页
      })
      .catch(() => {
        setSpinning(false)
        loginField()
      })
  }
  const loginField = () => {
    uploadAuditLog(
      [
        {
          auditType: 1,
          eventType: 1,
          eventDetailType: '登录',
          executionResult: '失败',
          auditLevel: 2,
          serviceAdress: `${baseUrl.common}/Users/SignIn`,
        },
      ],
      true
    )
  }
  const onKeyDownLogin = (e: any) => {
    if (e.keyCode === 13) {
      sureCutAccount()
    }
  }

  const cancelEvent = () => {
    if (!againLogin) {
      setState(false)
    } else {
      history.push('/login')
    }
  }

  useEffect(() => {
    clearWs?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Modal
      maskClosable={false}
      title="快捷登录"
      visible={state as boolean}
      destroyOnClose
      onCancel={() => cancelEvent()}
      footer={[
        <Button
          key="cancle"
          onClick={() => {
            setState(false)
            cancelEvent()
          }}
        >
          取消
        </Button>,
        <Button key="save" type="primary" onClick={() => sureCutAccount()} loading={spinning}>
          确定
        </Button>,
      ]}
    >
      <Form form={form} preserve={false} onKeyDown={(e) => onKeyDownLogin(e)}>
        <CyFormItem
          name="userName"
          label="账号"
          required
          labelWidth={100}
          rules={[
            {
              required: true,
              message: '请输入用户名/邮箱/手机号',
            },
          ]}
        >
          <Input placeholder="请输入用户名/邮箱/手机号" />
        </CyFormItem>
        <CyFormItem
          name="pwd"
          label="密码"
          required
          labelWidth={100}
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        >
          <Input type="password" {...noAutoCompletePassword} placeholder="请输入密码" />
        </CyFormItem>
        <CyFormItem name="code" label="验证码" required labelWidth={100}>
          <VerifycodeImage
            activeKey={'account'}
            needVerifycode={true}
            onChange={setImageCode}
            hasErr={hasErr}
            setHasErr={setHasErr}
            reloadSign={reloadSign}
            refreshCode={refreshCode}
          />
        </CyFormItem>
      </Form>
    </Modal>
  )
}

export default CutAccount
