import React from "react"

import styles from "./index.less"

const CyTip:React.FC = (props) => {
    return (
        <div className={styles.scTip}>
            {props.children}
        </div>
    )
}

export default CyTip