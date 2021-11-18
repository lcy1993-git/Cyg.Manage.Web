import React, { useState } from 'react'
import styles from './index.less'
import loginBg from '@/assets/image/login/bg.png'
import bannerSrc from '@/assets/image/login/banner.png'
import LoginForm from './components/login-form'
import LogoComponent from '@/components/logo-component'
import { useMount } from 'ahooks'
import { getProductServerList } from '@/services/index'
import StopServer from './components/stop-server'
const { NODE_ENV } = process.env

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
  const [serverCode, setServerCode] = useState<string>('')
  const [activeStop, setActiveStop] = useState<boolean>(false)

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
      setServerCode(currenServer?.code || '')
    }
  }
  const loginStop = (res: Stop) => {
    setActiveStop(true)
    if (res) {
      setStopInfo(res)
    }
  }
  useMount(async () => {
    await getServerList()
  })
  return (
    <div className={styles.loginPage}>
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
            ) : (
              <LoginForm serverCode={serverCode} stopLogin={loginStop} />
            )}
          </div>
        </div>
      </div>
      <div className={styles.loginPageFooter}>
        {/* <span>©2018- 四川长园工程勘察设计有限公司 版权所有 蜀ICP备18013772号</span> */}
        <span className={styles.copyRightTip}>版权所有</span>
        <span>©工程智慧云平台版权所有</span>
      </div>
    </div>
  )
}

export default Login
