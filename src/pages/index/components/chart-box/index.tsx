import React,{useRef, useState, useEffect} from "react";
import styles from "./index.less";
import ChartBoxLine from "@/pages/index/components/chart-box-line"
import ChartBoxHalo from "../chart-box-halo";
import { useMount, useSize } from "ahooks";

interface ChartBoxProps {
    titleAlign?: "left" | "center"
    title?: string
    tltleWidthLevel?: "normal" | "big"
}

const ChartBox: React.FC<ChartBoxProps> = (props) => {
    const divRef = useRef<HTMLDivElement>(null);

    const { titleAlign = "center", title,tltleWidthLevel = "normal"} = props;
    
    const boxAlignClassName = titleAlign === "center" ? styles.center : styles.left;

    const size = useSize(divRef)


    return (
        <div className={`${styles.chartBox} ${boxAlignClassName} ${styles[tltleWidthLevel]}`} ref={divRef}>
            <div className={styles.chartBoxLine}>
                <ChartBoxLine align={titleAlign} tltleWidthLevel={tltleWidthLevel} width={size.width ?? 0} />
            </div>
            <div className={styles.chartBoxHalo}>
                <ChartBoxHalo />
            </div>
            <div className={styles.chartBoxBgAboveContent}>
                <div className={styles.chartBoxTitle}>
                    {title}
                </div>
                <div className={styles.chartBoxContent}>
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default ChartBox