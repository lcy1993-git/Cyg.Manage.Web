import { getStopServerNotice, pollingHealth } from '@/services/index'
import { useInterval, useMount, useRequest } from 'ahooks'
import { message, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { history, useLocation } from 'umi'

const HealthPolling: React.FC = () => {
  const [requestFlag, setRequestFlag] = useState(true)
  const [serverCode, setServerCode] = useState('')
  const location = useLocation()
  //轮询
  const { run } = useRequest(() => pollingHealth(), {
    manual: true,
  })

  useEffect(() => {
    if (location.pathname && location.pathname === '/again-login') {
      setRequestFlag(false)
    } else {
      setRequestFlag(true)
    }
  }, [location.pathname])
  const getStopNotice = () => {
    getStopServerNotice({
      serverCode: serverCode,
      kickOutSeconds: 605,
    })
      .then((res) => {
        if (res.code === 200) {
          const { data } = res
          sessionStorage.setItem('stopServerInfo', JSON.stringify(data))
          let is600 = data?.countdownSeconds <= 602 && data.countdownSeconds >= 598
          let is300 = data?.countdownSeconds <= 302 && data.countdownSeconds >= 298
          let is60 = data?.countdownSeconds <= 62 && data.countdownSeconds >= 58
          if (is60 || is300 || is600) {
            notification.open({
              message: '停服通知',
              description: `您好！工程智慧云平台将在${is600 ? '10' : ''}${is300 ? '5' : ''}${
                is60 ? '1' : ''
              }分钟后进行停机维护，
            维护期间将无法使用平台，
            给您带来的不变我们深表歉意，
            维护结束后我们将在第一时间告知大家；`,
              bottom: 40,
              placement: 'bottomRight',
              duration: null,
            })
          }
          if (data.stage === 3) {
            const isTestUser = sessionStorage.getItem('isTestUser') === 'true'
            if (!isTestUser) {
              // 测试人员账号
              message.warning('正在停服发版中,请稍等...')
              setTimeout(() => {
                // 非测试账号直接退出登录
                history.push('/login')
                localStorage.setItem('Authorization', '')
              })
            }
          }
        }
      })
      .catch(() => {
        sessionStorage.setItem('stopServerInfo', '')
      })
  }

  useMount(() => {
    setServerCode(sessionStorage.getItem('serverCode') ?? '')
  })
  useInterval(async () => {
    if (requestFlag) {
      await run()
    }
    if (serverCode && serverCode !== 'null' && serverCode !== 'undefined') {
      getStopNotice()
    }
  }, 5000)
  return <div></div>
}

export default HealthPolling
