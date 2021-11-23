import { getStopServerNotice, pollingHealth } from '@/services/index'
import { useInterval, useRequest } from 'ahooks'
import React, { useState, useEffect } from 'react'
import { useLocation } from 'umi'
import { notification } from 'antd'
import { message } from 'antd/es'
import { history } from '@@/core/history'

const HealthPolling: React.FC = () => {
  const [requestFlag, setRequestFlag] = useState(true)
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

  useRequest(
    () =>
      getStopServerNotice({
        serverCode: sessionStorage.getItem('serverCode') as string,
        kickOutSeconds: 605,
      }),
    {
      pollingInterval: 5000,
      onSuccess: (val) => {
        if (val) {
          sessionStorage.setItem('stopServerInfo', JSON.stringify(val))
          let is600 = val?.countdownSeconds <= 602 && val.countdownSeconds >= 598
          let is300 = val?.countdownSeconds <= 302 && val.countdownSeconds >= 298
          let is60 = val?.countdownSeconds <= 62 && val.countdownSeconds >= 58
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
          if (val.stage === 3) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '')
            if (!userInfo?.isTestUser) {
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
      },
    }
  )
  useInterval(async () => {
    if (requestFlag) {
      await run()
    }
  }, 5000)
  return <div></div>
}

export default HealthPolling
