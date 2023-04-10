import React, { useState } from 'react'
import styles from './index.less'
import loginBg from '@/assets/image/login/bg.png'
import bannerSrc from '@/assets/image/login/banner.png'
import LoginForm from './components/login-form'
import LogoComponent from '@/components/logo-component'
import UpdatePassword from '@/pages/login/components/updatePassword'

const Login: React.FC = () => {
  const [updatePwd, setUpdatePwd] = useState(false)
  const [userName, setUserName] = useState('')
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginPageContent} style={{ backgroundImage: `url(${loginBg})` }}>
        <div className={styles.loginFormContent}>
          <div className={styles.loginFormBanner}>
            <LogoComponent className={styles.loginImage} />
            <img className={styles.bannerImage} src={bannerSrc} alt="" />
          </div>
          <div className={styles.loginForm}>
            {updatePwd ? (
              <div>
                <UpdatePassword updatePwd={setUpdatePwd} userName={userName} />
              </div>
            ) : (
              <LoginForm updatePwd={setUpdatePwd} updateUserName={setUserName} />
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
    </div>
  )
}

export default Login
