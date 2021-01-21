import React from "react";
import styles from "./index.less";
import loginBg from "@/assets/image/login/bg.png";
import bannerSrc from "@/assets/image/login/banner.png";
import logonSrc from "@/assets/image/logo.png";
import LoginForm from "./components/login-form";


const Login:React.FC = () => {
    return (
        <div className={styles.loginPage}>
            <div className={styles.loginPageContent} style={{backgroundImage: `url(${loginBg})`}}>
                <div className={styles.loginFormContent}>
                    <div className={styles.loginFormBanner}>
                        <img className={styles.loginImage} src={logonSrc} />
                        {/* UI切的图刚刚这么大的高度，所以logo只能定位上去 */}
                        <img className={styles.bannerImage} src={bannerSrc} alt=""/>
                    </div>
                    <div className={styles.loginForm}>
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className={styles.loginPageFooter}>
                <span className={styles.copyRightTip}>版权所有</span>
                <span>工程设计平台版权所有</span>
            </div>
        </div>
    )
}

export default Login