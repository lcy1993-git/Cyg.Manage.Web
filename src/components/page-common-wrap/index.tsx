import React from "react";
import styles from "./index.less";

const PageCommonWrap:React.FC = (props) => {
    return (
        <div className={styles.pageCommonWrap}>
            <div className={styles.pageCommonWrapContent}>
                {props.children}
            </div>
        </div>
    )
}

export default PageCommonWrap