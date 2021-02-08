import React,{useRef, useState} from "react";
import styles from "./index.less";
import ChartBoxLine from "@/pages/index/components/chart-box-line"
import ChartBoxHalo from "../chart-box-halo";
import { useMount } from "ahooks";

interface ChartBoxProps {
    titleAlign?: "left" | "center"
    title?: string
}

const ChartBox: React.FC<ChartBoxProps> = (props) => {
    const divRef = useRef<HTMLDivElement>(null);

    const [thisBoxWidth, setThisBoxWidth] = useState(0);

    const { titleAlign = "center", title } = props;
    
    const boxAlignClassName = titleAlign === "center" ? styles.center : styles.left;

    //const thisBoxWidth = divRef.current ? divRef.current.clientHeight : 500;

    useMount(() => {
        setThisBoxWidth(divRef.current ? divRef.current.clientWidth : 0)
    })

    return (
        <div className={`${styles.chartBox} ${boxAlignClassName}`} ref={divRef}>
            <div className={styles.chartBoxLine}>
                <ChartBoxLine align={titleAlign} width={thisBoxWidth} />
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