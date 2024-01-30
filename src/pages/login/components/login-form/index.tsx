import ImageIcon from '@/components/image-icon'
import VerificationCode from '@/components/verification-code'
import { Stop } from '@/pages/login'
import { loginRules } from '@/pages/login/components/login-form/rule'
import { baseUrl } from '@/services/common'
import {
  // compareVerifyCode,
  getAuthorityModules,
  GetCommonUserInfo,
  getConfigSwitch,
  // getUserInfoRequest,
  indexLoginRequest,
  PhoneLoginParams,
  // PhoneLoginParams,
  phoneLoginRequest,
  UserLoginParams,
} from '@/services/login'
import { getClientCategorys } from '@/services/personnel-config/company-user'
import { phoneNumberRule } from '@/utils/common-rule'
import {
  flatten,
  getStopServerList,
  handleDecrypto,
  noAutoCompletePassword,
  uploadAuditLog,
} from '@/utils/utils'
import { useMount, useRequest } from 'ahooks'
import { Button, Form, Input, message, Tabs } from 'antd'
import { isArray } from 'lodash'
import uuid from 'node-uuid'
import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import { history } from 'umi'
import VerifycodeImage from '../verifycode-image'
import styles from './index.less'

const { TabPane } = Tabs

export type LoginType = 'account' | 'phone'
interface Props {
  updatePwd: Dispatch<SetStateAction<boolean>>
  updateUserName: Dispatch<SetStateAction<string>>
  stopLogin: (data?: Stop) => void
}
const LoginForm: React.FC<Props> = (props) => {
  const { stopLogin } = props
  const { updatePwd, updateUserName } = props
  const [needVerifycode, setNeedVerifycode] = useState<boolean>(true)
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

  //获取验证码是否显示
  let hasCode: any = localStorage.getItem('EnableSignInCode')

  const [form] = Form.useForm()
  const userNameRef = useRef<Input>(null)
  const phoneRef = useRef<Input>(null)

  //cookie
  const [key] = useState<string>(uuid.v1())

  const { run: getClientList } = useRequest(() => getClientCategorys(), {
    manual: true,
  })

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

  const login = (type: LoginType, data: UserLoginParams | PhoneLoginParams) => {
    // TODO  校验通过之后进行保存

    form.validateFields().then(async (values) => {
      try {
        values.clientType = 2
        values.code = Number(hasCode) !== 0 ? imageCode : '*#*#*#'
        values.sessionKey = key
        setRequestLoading(true)
        const requestData = Object.assign({ ...values }, data)
        let resData: any
        if (type === 'account') {
          resData = await indexLoginRequest(requestData)
        } else {
          resData = await phoneLoginRequest(requestData)
        }

        const handleRes = handleDecrypto(resData)

        if (handleRes.code === 200 && handleRes.isSuccess) {
          const { accessToken } = handleRes.content
          localStorage.setItem('Authorization', accessToken)
          //存储评审、技能开关
          const category = await getClientList()
          const handleList = category.map((item) => item.value)
          localStorage.setItem('categoryList', JSON.stringify(handleList))

          const config = await getConfigSwitch('isOpenReview')
          config && localStorage.setItem('isOpenReview', config.value)

          //存储思极地图开关
          const sjConfig = await getConfigSwitch('useSjMap')
          sjConfig && localStorage.setItem('useSjMap', sjConfig.value)

          //websocket启用判断
          const hasSocket = await getConfigSwitch('EnableSocket')
          hasSocket && localStorage.setItem('EnableSocket', hasSocket.value)

          //wbs必填判断
          const wbsMust = await getConfigSwitch('wbsMust')
          wbsMust && localStorage.setItem('wbsMust', wbsMust.value)

          //提交项目时是否可选阶段
          const stageSelect = await getConfigSwitch('stageSelect')
          stageSelect && localStorage.setItem('stageSelect', stageSelect.value)

          const userInfo = await GetCommonUserInfo()
          userInfo && localStorage.setItem('userInfo', JSON.stringify(userInfo))

          const modules = await getAuthorityModules()
          if (type === 'account') {
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
          } else {
            uploadAuditLog([
              {
                auditType: 1,
                eventType: 1,
                eventDetailType: '登录',
                executionResult: '成功',
                auditLevel: 2,
                serviceAdress: `${baseUrl.common}/Users/SignInByPhone`,
              },
            ])
          }
          const buttonModules = flatten(modules)
          const buttonArray = buttonModules
            .filter((item: any) => item.category === 3)
            .map((item: any) => item.authCode)

          localStorage.setItem('functionModules', JSON.stringify(modules))
          localStorage.setItem('buttonJurisdictionArray', JSON.stringify(buttonArray))

          setNeedVerifycode(false)
          message.success('登录成功', 1.5)
          if (userInfo?.adminCategory === 1 && userInfo?.userType === 4) {
            // 是审计管理员
            localStorage.setItem('isAdminCategory', '0')
            history.push('/admin-index/home')
          } else {
            history.push('/index')
            localStorage.removeItem('isAdminCategory')
          }
        } else if (handleRes.code === 2002) {
          if (handleRes.content && isArray(handleRes.content) && handleRes.content.length > 0) {
            const errorMsgArray = handleRes.content.map((item: any) => item.errorMessages).flat()
            const filterErrorMsg = errorMsgArray.filter((item: any, index: any, arr: any) => {
              return arr.indexOf(item) === index
            })
            const showErrorMsg = filterErrorMsg.join('\n')
            message.error(showErrorMsg)
          } else {
            message.error(handleRes.message)
          }
        } else if (handleRes.code === 40100) {
          uploadFailMsg()
          // 临时关闭验证码，开启时，打开下行代码
          // setNeedVerifycode(true);
          message.error(handleRes.message)
        } else if (handleRes.code === 5000) {
          message.error(handleRes.message)
        } else if (handleRes.code === 40201) {
          uploadFailMsg()
          updateUserName(values.userName)
          updatePwd(true)
          message.error(handleRes.message)
        } else if (handleRes.code === 40202) {
          uploadFailMsg()
          message.error(handleRes.message)
          refreshCode()
        } else if (handleRes.code === 40200) {
          uploadFailMsg()
          refreshCode()
          message.info(handleRes.message)
        } else {
          uploadFailMsg()
          refreshCode()
          // message.info(resData.message)
        }
      } catch (msg) {
        refreshCode()
        uploadFailMsg()
      } finally {
        setRequestLoading(false)
      }
    })
  }
  const uploadFailMsg = () => {
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

  const getStopInfo = () => {
    if (form.getFieldValue(['userName']) && form.getFieldValue(['pwd'])) {
      setRequestLoading(true)
    }
    form.validateFields().then((values) => {
      getStopServerList(loginButtonClick, values, stopLogin)
    })
  }

  const loginButtonClick = (data: UserLoginParams | PhoneLoginParams) => {
    login(activeKey, data)
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
      getStopInfo()
    }
  }

  useMount(() => {
    localStorage.removeItem('isAdminCategory')
  })

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
                placeholder="请输入用户名/邮箱/手机号"
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
                {...noAutoCompletePassword}
                type="password"
                autoComplete="off"
              />
            </Form.Item>
            {hasCode !== 'undefined' && Number(hasCode) !== 0 && (
              <VerifycodeImage
                loginKey={key}
                userKey={getkey(activeKey)}
                activeKey={activeKey}
                needVerifycode={needVerifycode}
                onChange={setImageCode}
                hasErr={hasErr}
                setHasErr={setHasErr}
                reloadSign={reloadSign}
                refreshCode={refreshCode}
              />
            )}

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
              <VerificationCode
                canSend={canSendCode}
                type={0}
                phoneNumber={phoneNumber}
                onChange={setImageCode}
              />
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
