import ImageIcon from '@/components/image-icon'
import VerificationCode from '@/components/verification-code'
import { Stop } from '@/pages/login'
import { loginRules } from '@/pages/login/components/login-form/rule'
import { getProductServerList, getStopServerNotice } from '@/services/index'
import {
  compareVerifyCode,
  getAuthorityModules,
  getUserInfoRequest,
  indexLoginRequest,
  phoneLoginRequest,
} from '@/services/login'
import { phoneNumberRule } from '@/utils/common-rule'
import { flatten } from '@/utils/utils'
import { useRequest } from 'ahooks'
import { Button, Form, Input, message, Tabs } from 'antd'
import React, { useRef, useState } from 'react'
import { history } from 'umi'
import VerifycodeImage from '../verifycode-image'
import styles from './index.less'

const { TabPane } = Tabs
const { NODE_ENV } = process.env
export type LoginType = 'account' | 'phone'
interface Props {
  serverCode: string
  stopLogin: (data?: Stop) => void
}
const LoginForm: React.FC<Props> = (props) => {
  const { serverCode } = props
  const [needVerifycode, setNeedVerifycode] = useState<boolean>(false)
  const [imageCode, setImageCode] = useState<string>('')
  // 是否验证码错误
  const [hasErr, setHasErr] = useState(false)
  // 刷新验证码的hash值
  const random = () => Math.random().toString(36).slice(2)
  const [reloadSign, setReloadSign] = useState(random())
  const refreshCode = () => setReloadSign(random())
  const [activeKey, setActiveKey] = useState<LoginType>('account')
  const [formRules, setFormRules] = useState(loginRules['account'])
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [canSendCode, setCanSendCode] = useState<boolean>(false)
  const [requestLoading, setRequestLoading] = useState<boolean>(false)

  const [form] = Form.useForm()
  const userNameRef = useRef<Input>(null)
  const phoneRef = useRef<Input>(null)

  const tabChangeEvent = (activeKey: string) => {
    setActiveKey(activeKey as LoginType)
    // 根据不同的type,设置不同的校验规则
    setFormRules(loginRules[activeKey])
  }

  const getkey = (activeKey: LoginType) => {
    if (!userNameRef.current) return
    if (activeKey === 'account') {
      return userNameRef.current?.input.value
    } else {
      return phoneRef.current?.input.value
    }
  }

  const login = (type: LoginType, data?: Stop) => {
    // TODO  校验通过之后进行保存
    form.validateFields().then(async (values) => {
      if (
        [2, 3].includes(data?.stage as number) &&
        values?.userName?.startsWith(data?.testerAccountPrefix)
      ) {
        values.userName = values?.userName?.replace(data?.testerAccountPrefix, '')
      }
      try {
        let resData = null
        if (type === 'account') {
          resData = await indexLoginRequest(values)
        } else {
          resData = await phoneLoginRequest(values)
        }
        if (resData.code === 200 && resData.isSuccess) {
          const { accessToken } = resData.content

          localStorage.setItem('Authorization', accessToken)
          let userInfo = await getUserInfoRequest()
          if (data?.stage) {
            const userName = form.getFieldValue('userName')
            userInfo['isTestUser'] =
              [2, 3].includes(data?.stage) && userName.startsWith(data?.testerAccountPrefix) // 是否测试账号
          }
          const modules = await getAuthorityModules()

          const buttonModules = flatten(modules)

          const buttonArray = buttonModules
            .filter((item: any) => item.category === 3)
            .map((item: any) => item.authCode)

          localStorage.setItem('functionModules', JSON.stringify(modules))
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
          localStorage.setItem('buttonJurisdictionArray', JSON.stringify(buttonArray))

          setNeedVerifycode(false)
          message.success('登录成功', 1.5)
          history.push('/index')
        } else if (resData.code === 40100) {
          // 临时关闭验证码，开启时，打开下行代码
          message.error(resData.message)
        } else {
          message.error(resData.message)
        }
      } catch (msg) {
      } finally {
        setRequestLoading(false)
      }
    })
  }
  const getStopServerNoticeReq = async (serverCode: string) => {
    const res = await getStopServerNotice({
      serverCode: serverCode,
      kickOutSeconds: 605,
    })
    return res
  }

  const getServerList = async () => {
    const res = await getProductServerList({
      productCode: '1301726010322214912',
      category: 0,
      status: 0,
      province: '',
    })
    const currenServer = res?.find((item: { propertys: { webSite: string } }) => {
      if (NODE_ENV === 'development') {
        return item.propertys?.webSite === 'http://10.6.1.40:21528/login'
      } else {
        return item.propertys?.webSite === window.location.href
      }
    })
    if (currenServer) {
      sessionStorage.setItem('serverCode', currenServer?.code || '')
      return currenServer
    } else {
      return ''
    }
  }
  const getStopInfo = async () => {
    setRequestLoading(true)
    if (serverCode === '') {
      // 如果前面没有获取到停服信息,在这里再获取一遍
      try {
        getServerList()
          .then(async (res) => {
            if (res) {
              let val = await getStopServerNoticeReq(res.code)
              if (!val) {
                await loginButtonClick()
                return
              }
              if ([2, 3].includes(val?.stage) && val?.testerAccountPrefix !== '') {
                // 停服公告,前缀没有也直接放行
                const data = form.getFieldsValue()
                if (!data?.userName?.startsWith(val?.testerAccountPrefix)) {
                  props.stopLogin(val)
                  return
                }
              }
              await loginButtonClick(val)
              return
            }
          })
          .catch(() => {
            loginButtonClick()
          })
      } catch {
        await loginButtonClick()
      }
    } else {
      // 停服公告,前缀没有也直接放行
      const data = form.getFieldsValue()
      if (serverCode !== undefined && serverCode !== null) {
        let val = await getStopServerNoticeReq(serverCode)
        if (
          val !== null &&
          !data?.userName?.startsWith(val?.testerAccountPrefix) &&
          [2, 3].includes(val?.stage)
        ) {
          props.stopLogin(val)
          return
        }
        await loginButtonClick(val)
      } else {
        await loginButtonClick()
      }
    }
  }
  // 登录前的验证码校准，当needVerifycode存在先行判断验证码
  const loginButtonClick = async (data?: Stop) => {
    if (needVerifycode) {
      let fromData = await form.validateFields()
      const key = activeKey === 'account' ? fromData.userName : fromData.phone
      const codeRes = await compareVerifyCode(key, imageCode)
      if (codeRes.content === true) {
        login(activeKey, data)
      } else {
        message.error('验证码校验错误')
        refreshCode()
        setHasErr(true)
      }
    } else {
      login(activeKey, data)
    }
  }

  const formChangeEvent = (changedValues: object) => {
    if (changedValues.hasOwnProperty('phone')) {
      setPhoneNumber(changedValues['phone'])
      const canSendSms = phoneNumberRule.test(changedValues['phone'])
      setCanSendCode(canSendSms)
    }
  }

  const onKeyDownLogin = (e: any) => {
    if (e.keyCode === 13) {
      login('account')
    }
  }

  return (
    <Form form={form} onValuesChange={formChangeEvent} onKeyDown={(e) => onKeyDownLogin(e)}>
      <div className={styles.loginFormTitle}>
        <span className={styles.welcomeTitle}>Hello!</span>
        <span>欢迎回来</span>
      </div>
      <div className={styles.loginTypeTabs}>
        <Tabs defaultActiveKey="account" activeKey={activeKey} onChange={tabChangeEvent}>
          <TabPane tab="账号密码登录" key="account">
            <Form.Item className={styles.accountInput} name="userName" rules={formRules.account}>
              <Input
                placeholder="用户名"
                className={styles.loginInput}
                suffix={<ImageIcon imgUrl="user.png" />}
                type="text"
                ref={userNameRef}
              />
            </Form.Item>

            <Form.Item className={styles.passwordInput} name="pwd" rules={formRules.password}>
              <Input
                onPaste={(e) => e.preventDefault()} // 禁用粘贴
                placeholder="密码"
                className={styles.loginInput}
                suffix={<ImageIcon imgUrl="lock.png" />}
                type="password"
              />
            </Form.Item>
            <VerifycodeImage
              userKey={getkey(activeKey)}
              activeKey={activeKey}
              needVerifycode={needVerifycode}
              onChange={setImageCode}
              hasErr={hasErr}
              setHasErr={setHasErr}
              reloadSign={reloadSign}
              refreshCode={refreshCode}
            />
            <div>
              <Button
                className={styles.loginButton}
                onClick={getStopInfo}
                loading={requestLoading}
                type="primary"
              >
                立即登录
              </Button>
            </div>
          </TabPane>
          <TabPane tab="手机验证码登录" key="phone">
            <Form.Item
              className={styles.phoneInput}
              name="phone"
              rules={formRules.phone}
              validateTrigger="onBlur"
            >
              <Input
                suffix={<ImageIcon imgUrl="phone.png" />}
                placeholder="手机号"
                className={styles.loginInput}
                type="text"
                ref={phoneRef}
              />
            </Form.Item>

            <Form.Item
              className={styles.verificationCode}
              name="code"
              rules={formRules.verificationCode}
            >
              <VerificationCode canSend={canSendCode} type={0} phoneNumber={phoneNumber} />
            </Form.Item>
            <VerifycodeImage
              userKey={getkey(activeKey)}
              needVerifycode={needVerifycode}
              onChange={setImageCode}
              hasErr={hasErr}
              setHasErr={setHasErr}
              reloadSign={reloadSign}
              refreshCode={refreshCode}
            />
            <div>
              <Button className={styles.loginButton} onClick={getStopInfo} type="primary">
                立即登录
              </Button>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Form>
  )
}

export default LoginForm
