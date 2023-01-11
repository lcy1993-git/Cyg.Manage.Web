import CyFormItem from '@/components/cy-form-item'
import { useLayoutStore } from '@/layouts/context'
import { getAuthorityModules, getUserInfoRequest, userLoginRequest } from '@/services/login'
import { useGetUserInfo } from '@/utils/hooks'
import { flatten, getStopServerList } from '@/utils/utils'
import { useControllableValue } from 'ahooks'
import { Button, Form, Input, message, Modal, Space } from 'antd'
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
  const lastAccount = useGetUserInfo()

  const getStopInfo = () => {
    setSpinning(true)
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
  const sureCutAccount = async (value: { userName: any; pwd: any }) => {
    const { userName, pwd } = value
    // TODO 快捷切换
    userLoginRequest({ userName, pwd })
      .then(async (resData) => {
        // 如果这次登录的账号跟之前的不一样，那么就只到首页

        const isLastAccount = lastAccount && lastAccount.userName === userName

        const { accessToken } = resData
        localStorage.setItem('Authorization', accessToken)

        const userInfo = await getUserInfoRequest()
        const modules = await getAuthorityModules()

        const buttonModules = flatten(modules)
        const buttonArray = buttonModules
          .filter((item: any) => item.category === 3)
          .map((item: any) => item.authCode)

        localStorage.setItem('functionModules', JSON.stringify(modules))
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        localStorage.setItem('buttonJurisdictionArray', JSON.stringify(buttonArray))
        setSpinning(false)
        if (!againLogin || !isLastAccount) {
          setState(false)
          message.success('账户快捷登录成功')
          history.push('/index')
          window.location.reload()
        } else {
          finishEvent?.()
          //history.go(-1);
          setState(false)
        }
      })
      .catch(() => {
        setSpinning(false)
      })
  }

  const onKeyDownLogin = (e: any) => {
    if (e.keyCode == 13) {
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
      okText="确定"
      footer={null}
      cancelText="取消"
      onCancel={() => cancelEvent()}
    >
      <Form form={form} preserve={false} onKeyDown={(e) => onKeyDownLogin(e)}>
        <CyFormItem
          name="userName"
          label="用户名"
          required
          labelWidth={100}
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        >
          <Input placeholder="请输入" />
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
          <Input type="password" placeholder="请输入" />
        </CyFormItem>
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            padding: '10px 0',
          }}
        >
          <Space>
            <Button onClick={() => cancelEvent()}>取消</Button>
            <Button onClick={getStopInfo} type={'primary'} disabled={spinning}>
              确定
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  )
}

export default CutAccount
