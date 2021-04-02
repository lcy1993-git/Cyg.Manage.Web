import React from "react";
import styles from "./index.less";
import bgSrc from "@/assets/image/index/bg.png";
import { useRequest } from "ahooks";
import { getChartConfig } from "@/services/operation-config/cockpit";

const Index: React.FC = () => {
    
    const {data} = useRequest(() => getChartConfig())

    console.log(JSON.parse(data ?? "{}"))

    return (
        <div className={styles.indexPage} style={{ backgroundImage: `url(${bgSrc})` }}>
            
        </div>
    )
}

export default Index