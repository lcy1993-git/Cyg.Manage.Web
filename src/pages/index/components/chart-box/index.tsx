import React,{useRef, useState, useEffect} from "react";
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

    useMount(() => {
        setThisBoxWidth(divRef.current ? divRef.current.clientWidth : 0)
    })

    const setLineWidth = () => {
        setThisBoxWidth(divRef.current ? divRef.current.clientWidth : 0)
    }

    useEffect(() => {
        window.addEventListener('resize', () => {
			if (!divRef.current) { // 如果切换到其他页面，这里获取不到对象，删除监听。否则会报错
		        window.removeEventListener('resize', setLineWidth);
		        return;
		    }else {
                setLineWidth()
            }
		});
       
        () => {
            window.removeEventListener('resize', setLineWidth);
        }
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