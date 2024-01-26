import { bindEmail, sendBindEmailCode, unBindEmail } from '@/services/user/user-info'
import { handleDecrypto } from '@/utils/utils'
import { Button, Input, message, Popconfirm, Space } from 'antd'
import classNames from 'classnames'
import _ from 'lodash'
import { useRef, useState } from 'react'
import { isRegularCode } from '../../person-info-rule'
import styles from '../phone-info/index.less'

interface EmailInfoProps {
  email: undefined | string
  refresh: () => void
  cancelEmail: () => void
}
type Step = 0 | 1 | 2

const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

const EmailInfo: React.FC<EmailInfoProps> = ({ email, refresh, cancelEmail }) => {
  const [step, setStep] = useState<Step>(email ? 0 : 1)

  const [currentEmail, setCurrentEmail] = useState<string>('')

  const [sendCodeLoading, setSendCodeLoading] = useState(false)

  const bindEmailRef = useRef<Input>(null)
  const codeRef = useRef<Input>(null)

  const bindEmailHandler = () => {
    const emailNumber = bindEmailRef.current!.input.value
    if (!emailNumber) {
      message.error('请输入有效的邮箱地址')
    } else if (!regEmail.test(emailNumber)) {
      message.error('邮箱格式有误')
    } else if (bindEmailRef.current!.input.value.length > 20) {
      message.error('邮箱字符过长')
    } else if (bindEmailRef.current!.input.value === email) {
      message.error('更换的邮箱不能与原邮箱地址相同')
    } else {
      setSendCodeLoading(true)
      sendBindEmailCode(emailNumber)
        .then(() => {
          setCurrentEmail(emailNumber)
          setStep(2)
          setSendCodeLoading(false)
        })
        .catch(() => {
          setSendCodeLoading(false)
        })
    }
  }

  const gotoOpenEmailWindow = () => {
    const emailRootName = currentEmail.match(/(?<=@).+?(?=\.)/)
    if (emailRootName) {
      window.open(`http://mail.${emailRootName[0]}.com`)
    } else {
      message.error('邮箱格式不合法')
    }
  }

  const sendAgain = _.throttle(() => {
    sendBindEmailCode(currentEmail).then(() => message.success('邮箱已发送，请查收'))
  }, 1000)

  const filishClickHandler = _.throttle(() => {
    const code = codeRef.current?.input.value!
    if (isRegularCode(code)) {
      bindEmail(currentEmail, code).then((res) => {
        const handleRes = handleDecrypto(res)
        if (handleRes.isSuccess) {
          message.success('绑定成功')
          refresh()
        } else {
          message.error(handleRes.message)
        }
      })
    } else {
      message.error('验证码格式有误，请输入有效6位数验证码')
    }
  }, 1000)

  const handlerUnbindEmail = () => {
    unBindEmail().then(() => {
      message.success('解绑成功')
      refresh()
    })
  }

  const getStepComponent = (step: Step) => {
    // 已绑定手机
    if (step === 0) {
      return (
        <>
          <div className={styles.minHeight60}>已经绑定邮箱: {email}</div>
          <div className={classNames(styles.ml110, styles.minHeight60)}>
            <Space>
              <Button onClick={() => setStep(1)} type="primary">
                更换邮箱
              </Button>
              {email && (
                <Popconfirm
                  placement="top"
                  title="解绑后无法通过该邮箱号登录，是否解绑？"
                  onConfirm={handlerUnbindEmail}
                >
                  <Button>解除绑定</Button>
                </Popconfirm>
              )}
            </Space>
          </div>
        </>
      )
      // 绑定新手机
    } else if (step === 1) {
      return (
        <>
          <div className={classNames(styles.minHeight60, styles.flex)}>
            <div className={styles.base60}>邮箱: </div>
            <div>
              <Input style={{ width: '200px' }} placeholder="请填写您的邮箱" ref={bindEmailRef} />
            </div>
          </div>
          <div className={classNames(styles.minHeight60, styles.ml60)}>
            <Button type="primary" onClick={bindEmailHandler} loading={sendCodeLoading}>
              下一步
            </Button>
            <Button className={styles.ml12} onClick={() => (email ? setStep(0) : cancelEmail())}>
              取消
            </Button>
          </div>
        </>
      )
      // 获取验证码
    } else if (step === 2) {
      return (
        <>
          <div className={styles.minHeight60}>
            <span style={{ display: 'inline-block', width: '56px' }}>邮箱: </span>
            {currentEmail}验证邮件已发出，去
            <span className={styles.link} onClick={gotoOpenEmailWindow}>
              查收
            </span>
            或
            <span className={styles.link} onClick={sendAgain}>
              再发一次
            </span>
          </div>
          <div className={classNames(styles.minHeight60, styles.flex)}>
            {/* <PersonInfoModalVerificationCode type={4} phoneNumber={currentEmail} canSend={true} /> */}
            <div>验证码：</div>
            <div>
              <Input placeholder="验证码" ref={codeRef}></Input>
            </div>
          </div>
          <div className={classNames(styles.minHeight60, styles.flex, styles.ml60)}>
            <Button type="primary" onClick={filishClickHandler}>
              绑定
            </Button>
            <Button className={styles.ml12} onClick={() => setStep(email ? 0 : 1)}>
              取消
            </Button>
          </div>
        </>
      )
    }
    return null
  }
  return <div className={styles.phoneInfoWrap}>{getStepComponent(step)}</div>
}

export default EmailInfo
