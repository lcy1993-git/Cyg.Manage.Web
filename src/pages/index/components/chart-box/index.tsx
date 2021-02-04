import React from "react";
import styles from "./index.less"

interface ChartBoxProps {
    titleAlign?: "left" | "center"
    title?: string
}

const ChartBox:React.FC<ChartBoxProps> = (props) => {
    const {titleAlign = "center",title} = props;

    return (
        <div className={styles.chartBox}>
            <div className={styles.chartBoxTitle}>
                {title}
            </div>
            <div className={styles.chartBoxContent}>
                {props.children}
            </div>
        </div>
    )
}

export default ChartBox