import React from 'react';
import styles from './index.less';
import loginBg from '@/assets/image/login/bg.png';
import bannerSrc from '@/assets/image/login/banner.png';
import LoginForm from './components/login-form';
import LogoComponent from '@/components/logo-component';

const Login: React.FC = () => {
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
            <LoginForm />
          </div>
        </div>
      </div>
      <div className={styles.loginPageFooter}>
        {/* <span>©2018- 四川长园工程勘察设计有限公司 版权所有 蜀ICP备18013772号</span> */}
        <span className={styles.copyRightTip}>版权所有</span>
        <span>©工程智慧云平台版权所有</span>
      </div>
    </div>
  );
};

export default Login;
