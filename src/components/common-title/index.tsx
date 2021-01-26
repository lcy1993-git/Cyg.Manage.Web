import React from "react";
import styles from "./index.less";

const CommonTitle:React.FC = (props) => {
    return (
        <div className={styles.commonTitle}>
            <span className={styles.commonTitleIcon}></span>
            <span className={styles.commonTitleWord}>
                {
                    props.children
                }
            </span>
        </div>
    )
}

export default CommonTitle