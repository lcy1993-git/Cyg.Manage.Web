import React from "react";
import styles from "./index.less";

interface CommonTitleProps {
    noPadding?: boolean
}

const CommonTitle:React.FC<CommonTitleProps> = (props) => {
    const {noPadding = false} = props;
    return (
        <div className={styles.commonTitle} style={noPadding ? {paddingBottom: "0px"} : undefined}>
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