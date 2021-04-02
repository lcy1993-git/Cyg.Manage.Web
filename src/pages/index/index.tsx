import React from "react";
import styles from "./index.less";
import bgSrc from "@/assets/image/index/bg.png";
import { useRequest } from "ahooks";
import { getChartConfig } from "@/services/operation-config/cockpit";
import { useMemo } from "react";

const Index: React.FC = () => {
    
    const {data} = useRequest(() => getChartConfig())

    const handleData = useMemo(() => {
        if(data) {
            return JSON.parse(data)
        }
        return []
    }, [data])

    console.log(handleData)

    return (
        <div className={styles.indexPage} style={{ backgroundImage: `url(${bgSrc})` }}>
            
        </div>
    )
}

export default Index