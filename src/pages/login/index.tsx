import React from "react";
import styles from "./index.less";

import loginsj from "@/assets/image/loginsj.png";
import cloudImg from "@/assets/image/clouds.png";
import lightImg from "@/assets/image/light.png";
import logoNewSrc from "@/assets/image/logoNew.png";
import formBg from "@/assets/image/formBg.png";
import loginFormImg from "@/assets/image/left.png";
import LoginForm from "@/pages/login/login-form";

const Login: React.FC = () => {
    return (
        <div className={styles.loginPage}>
            <div className={styles.loginPageHeader}>
                <img src={loginsj} className={styles.loginPageHeaderIcon} />
                <span>欢迎登录管理端</span>
            </div>
            <div className={styles.loginPageContent}>
                <div className={styles.loginPageBg}>
                    <div className={styles.cloudOne}>
                        <img src={cloudImg} />
                    </div>
                    <div className={styles.cloudTwo}>
                        <img src={cloudImg} />
                    </div>
                    <div className={styles.lightCircle} style={{ backgroundImage: `url(${lightImg})` }} />

                </div>
                <div className={styles.loginPageFormBg} style={{ backgroundImage: `url(${formBg})` }} />

                <div className={styles.loginPageFormContent}>
                    <div className={styles.platformLogo}>
                        <img src={logoNewSrc} alt="" />
                    </div>
                    <div className={styles.loginForm} style={{ backgroundImage: `url(${loginFormImg})` }}>
                        <div className={styles.loginFormTitle}>
                            <span className={styles.loginTitleUser}>用户登录</span>
                            <span className={styles.loginTitleUserEn}>UserLogin</span>
                        </div>
                        <div className={styles.formContent}>
                            <LoginForm />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.loginPageFooter}>
                <span className={styles.loginPageFooterTip}>工程云设计平台</span>
                <span>版权所有</span>
            </div>
        </div>
    )
}

export default Login