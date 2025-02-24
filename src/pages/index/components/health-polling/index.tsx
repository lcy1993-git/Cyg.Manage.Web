import { useLayoutStore } from '@/layouts/context'
import { getStopServerNotice, pollingHealth } from '@/services/index'
import { postMsg } from '@/utils/utils'
import { useInterval, useMount, useRequest } from 'ahooks'
import { message, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { history, useLocation } from 'umi'

const HealthPolling: React.FC = () => {
  const { setNewSocket } = useLayoutStore()
  const [requestFlag, setRequestFlag] = useState(true)
  const [serverCode, setServerCode] = useState('')
  const location = useLocation()

  const hasSocket = localStorage.getItem('EnableSocket')

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
    if (!requestFlag) return
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
            postMsg('Func_StopService')
            notification.open({
              message: '停服通知',
              description: `您好！工程智慧云平台将在${is600 ? '10' : ''}${is300 ? '5' : ''}${
                is60 ? '1' : ''
              }分钟后进行停机维护，
            维护期间将无法使用平台，
            给您带来的不便我们深表歉意，
            维护结束后我们将在第一时间告知大家。`,
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
    setServerCode(localStorage.getItem('serverCode') ?? '')
  })
  useInterval(async () => {
    if (requestFlag) {
      await run()
    }
    if (serverCode && serverCode !== 'null' && serverCode !== 'undefined') {
      getStopNotice()
    }
  }, 60000)

  //轮询

  //获取token
  const token = localStorage.getItem('Authorization')

  //客户端模式下获取host
  const host = localStorage.getItem('requestHost')

  //获取socketurl
  const getSocketUrl = () => {
    if (window.chrome.webview) {
      return host?.split('//')[1].split('/')[0]
    } else {
      return window.location.host
    }
  }

  const url =
    window.location.hostname === 'localhost' ? 'srthkf2.gczhyun.com:21530' : getSocketUrl()
  /**webSocket */
  let heart: any //心跳
  var lockReconnect = false //避免重复连接
  var ws: WebSocket

  //创建websocket
  const createWebSocket = () => {
    if (window.WebSocket) {
      ws = new WebSocket(`wss://${url}/usercenter-ws/?accessToken=${token}`)
    }
    setNewSocket?.(ws)
    window.location.hostname !== 'localhost' && initWebSocket()
  }

  //断开重连
  const reconnect = () => {
    if (lockReconnect) return
    lockReconnect = true

    setTimeout(() => {
      createWebSocket()
      lockReconnect = false
    }, 2000)
  }

  //ws事件初始化
  const initWebSocket = () => {
    ws.onopen = () => {
      heart = setInterval(() => {
        if (ws.readyState === 1) {
          ws.send('PING')
        }
      }, 6000)
    }
    ws.onclose = () => {
      const currentToken = localStorage.getItem('Authorization')
      //如果浏览器未操作自动断开，根据token判断是主动关闭还是被动断开，来重连websocket或清除心跳。
      if (!currentToken) {
        clearInterval(heart)
        return
      }

      reconnect()
    }
    ws.onmessage = () => {}
    ws.onerror = () => {
      clearInterval(heart)
      reconnect()
    }
  }

  //登录初始化连接webSocket，退出卸载
  useEffect(() => {
    if ((token && Number(hasSocket) !== 0) || hasSocket === null) {
      createWebSocket()
    }
    return () => {
      ws?.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <div></div>
}

export default HealthPolling
