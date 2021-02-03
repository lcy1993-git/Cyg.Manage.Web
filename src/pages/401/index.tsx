import PageCommonWrap from "@/components/page-common-wrap";
import React from "react";
import styles from "./index.less";
import imgSrc from "@/assets/image/401.png"

const NoJurisdictionPage:React.FC = () => {
    return (
        <PageCommonWrap>
            <div className={styles.noJurisdictionPage}>
                <div className={styles.noJurisdictionImage}>
                    <img src={imgSrc} />
                </div>
                <div className={styles.noJurisdictionTipImportant}>
                    无访问权限
                </div>
                <div className={styles.noJurisdictionTip}>
                    请尝试重新登录，或联系管理员进行授权
                </div>
            </div>
        </PageCommonWrap>
    )
}

export default NoJurisdictionPage