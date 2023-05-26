import bannerSrc from '@/assets/image/login/banner.png'
import loginBg from '@/assets/image/login/bg.png'
import LogoComponent from '@/components/logo-component'
import { getAuthorityModules, getUserInfoRequest, qgcAutoLoginRequest } from '@/services/login'
import { flatten } from '@/utils/utils'
import { useMount } from 'ahooks'
import { Spin } from 'antd'
import React, { useLayoutEffect, useState } from 'react'
import { history } from 'umi'
import LoginForm from './components/login-form'
// import StopServer from './components/stop-server'
import styles from './index.less'

import UpdatePassword from '@/pages/login/components/updatePassword'
import StopServer from './components/stop-server'

export interface Stop {
  content: string
  countdownSeconds: number
  createdOn: number
  id: string
  stage: number
  testerAccountPrefix: string
}

const Login: React.FC = () => {
  const [stopInfo, setStopInfo] = useState<Stop>({} as Stop)
  const isTrans = localStorage.getItem('isTransfer')
  const [userName, setUserName] = useState('')
  const [updatePwd, setUpdatePwd] = useState(false)
  const [activeStop, setActiveStop] = useState<boolean>(false)
  const [isAutoLogin, setIsAutoLogin] = useState<boolean>(false)

  const getServerList = async () => {}

  const loginStop = (res?: Stop) => {
    setActiveStop(true)
    if (res) {
      setStopInfo(res)
    }
  }

  useMount(async () => {
    await getServerList()
  })
  useLayoutEffect(() => {
    ;(async function () {
      let url = window.location.href
      url = url.toLocaleLowerCase()
      if (url.indexOf('ticket') > -1 && Number(isTrans) === 1) {
        setIsAutoLogin(true)
        var query = window.location.search.substring(1)
        var vars = query.split('&')
        const map: any = {}
        for (let i = 0; i < vars.length; i++) {
          let pair = vars[i].split('=')
          map[pair[0]] = pair[1]
        }
        // @ts-ignore
        let resData = await qgcAutoLoginRequest({ ticket: map.ticket })
        if (resData.code === 200 && resData.isSuccess) {
          // @ts-ignore
          const { accessToken } = resData.content

          localStorage.setItem('Authorization', accessToken)
          let userInfo = await getUserInfoRequest()

          const modules = await getAuthorityModules()

          const buttonModules = flatten(modules)

          const buttonArray = buttonModules
            .filter((item: any) => item.category === 3)
            .map((item: any) => item.authCode)
          localStorage.setItem('functionModules', JSON.stringify(modules))
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
          localStorage.setItem('buttonJurisdictionArray', JSON.stringify(buttonArray))

          history.push('/index')
        }
      }
    })()
  }, [])

  return (
    <div className={styles.loginPage}>
      {isAutoLogin ? (
        <Spin tip="正在加载...">
          <div className={styles.autoLogin}></div>
        </Spin>
      ) : (
        <>
          <div className={styles.loginPageContent} style={{ backgroundImage: `url(${loginBg})` }}>
            <div className={styles.loginFormContent}>
              <div className={styles.loginFormBanner}>
                <LogoComponent className={styles.loginImage} />
                {/* UI切的图刚刚这么大的高度，所以logo只能定位上去 */}
                <img className={styles.bannerImage} src={bannerSrc} alt="" />
              </div>
              <div className={styles.loginForm}>
                {activeStop ? (
                  <StopServer data={stopInfo} />
                ) : updatePwd ? (
                  <div>
                    <UpdatePassword updatePwd={setUpdatePwd} userName={userName} />
                  </div>
                ) : (
                  <LoginForm
                    updatePwd={setUpdatePwd}
                    updateUserName={setUserName}
                    stopLogin={loginStop}
                  />
                )}
              </div>
            </div>
          </div>
          <div className={styles.loginPageFooter}>
            {/* <span>©2018- 四川长园工程勘察设计有限公司 版权所有 蜀ICP备18013772号</span> */}
            <span className={styles.copyRightTip}>版权所有</span>
            <span>©工程智慧云平台版权所有</span>
            <a className={styles.linkToBeian} href="https://beian.miit.gov.cn/">
              蜀ICP备2021026719号-1
            </a>
          </div>
        </>
      )}
    </div>
  )
}

export default Login
