import React from "react";
import styles from "./index.less";

interface ReadonlyItemProps {
    label?: string | React.ReactNode
    labelWidth?: number
    align?: "right" | "left" | "center"
}

const ReadonlyItem:React.FC<ReadonlyItemProps> = (props) => {
    const {label, labelWidth = 70, align = "right"} = props;
    return (
        <div className={styles.readonlyItem}>
            <div className={styles.readonlyItemLabel} style={{width: `${labelWidth}px`,textAlign: align}}>
                {label}
            </div>
            <div className={styles.readonlyItemContent}>
                {props.children}
            </div>
        </div>
    )
}

export default ReadonlyItem