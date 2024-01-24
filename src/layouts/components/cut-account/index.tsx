import CyFormItem from '@/components/cy-form-item'
import { useLayoutStore } from '@/layouts/context'
import VerifycodeImage from '@/pages/login/components/verifycode-image'
import { baseUrl } from '@/services/common'
import {
  getAuthorityModules,
  GetCommonUserInfo,
  // getUserInfoRequest,
  // qgcLoginRequest,
  userLoginRequest,
} from '@/services/login'
import { useGetUserInfo } from '@/utils/hooks'
import {
  flatten,
  getStopServerList,
  handleDecrypto,
  noAutoCompletePassword,
  uploadAuditLog,
} from '@/utils/utils'
import { useControllableValue } from 'ahooks'
import { Button, Form, Input, message, Modal } from 'antd'
import { isArray } from 'lodash'
import uuid from 'node-uuid'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { history } from 'umi'

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

  //获取验证码是否显示
  let hasCode = localStorage.getItem('EnableSignInCode')

  //cookie
  const [key] = useState<string>(uuid.v1())
  // 刷新验证码的hash值
  const random = () => Math.random().toString(36).slice(2)
  const [reloadSign, setReloadSign] = useState(random())
  const refreshCode = () => setReloadSign(random())
  // 是否验证码错误
  const [hasErr, setHasErr] = useState(false)

  const getStopInfo = () => {
    form.validateFields().then((values) => {
      getStopServerList(sureCutAccount, values, showStop)
    })
  }

  const showStop = () => {
    // message.warning('正在停服发版中,请稍等...')
    setTimeout(() => {
      // 非测试账号直接退出登录
      history.push('/login')
      localStorage.setItem('Authorization', '')
    }, 1000)
    setSpinning(false)
  }

  const sureCutAccount = async (data: { userName: any; pwd: any }) => {
    setSpinning(true)
    form
      .validateFields()
      .then(async (value) => {
        const { userName } = value
        value.code = Number(hasCode) !== 0 ? imageCode : '*#*#*#'
        value.sessionKey = key
        // TODO 快捷切换

        const requestData = Object.assign({ ...value }, data)

        const resData = await userLoginRequest(requestData)
        const handleRes = handleDecrypto(resData)
        if (handleRes.code === 200 && handleRes.isSuccess) {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const lastAccount = useGetUserInfo()

          const isLastAccount = lastAccount && lastAccount.userName === userName
          // @ts-ignore
          const { accessToken } = handleRes.content

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
        } else if (handleRes.code === 2002) {
          if (handleRes.content && isArray(handleRes.content) && handleRes.content.length > 0) {
            const errorMsgArray = handleRes.content.map((item: any) => item.errorMessages).flat()
            const filterErrorMsg = errorMsgArray.filter((item: any, index: any, arr: any) => {
              return arr.indexOf(item) === index
            })
            const showErrorMsg = filterErrorMsg.join('\n')
            message.error(showErrorMsg)
            setSpinning(false)
          } else {
            message.error(handleRes.message)
            setSpinning(false)
          }
        } else if (handleRes.code === 5000) {
          message.error(handleRes.message)
          setSpinning(false)
        } else if (handleRes.code === 40100) {
          // 临时关闭验证码，开启时，打开下行代码
          // setNeedVerifycode(true);
          message.error(handleRes.message)
          loginField()
          setSpinning(false)
        } else if (handleRes.code === 40201) {
          history.push('/index')
          message.error(handleRes.message)
          setSpinning(false)
        } else if (handleRes.code === 40202) {
          message.error(handleRes.message)
          loginField()
          refreshCode()
          setSpinning(false)
        } else if (handleRes.code === 40200) {
          refreshCode()
          loginField()
          message.warning(handleRes.message)
          setSpinning(false)
        } else {
          loginField()
          refreshCode()
          message.warning(handleRes.message)
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
      getStopInfo()
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
        <Button key="save" type="primary" onClick={getStopInfo} loading={spinning}>
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
        {Number(hasCode) !== 0 && (
          <CyFormItem name="code" label="验证码" required labelWidth={100}>
            <VerifycodeImage
              loginKey={key}
              activeKey={'account'}
              needVerifycode={true}
              onChange={setImageCode}
              hasErr={hasErr}
              setHasErr={setHasErr}
              reloadSign={reloadSign}
              refreshCode={refreshCode}
            />
          </CyFormItem>
        )}
      </Form>
    </Modal>
  )
}

export default CutAccount
