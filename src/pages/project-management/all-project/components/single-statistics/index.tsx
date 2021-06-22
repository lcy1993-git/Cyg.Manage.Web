import { RightOutlined } from "@ant-design/icons";
import React from "react";
import styles from "./index.less";

interface SingleStatisticsProps {
    label: string
    icon: string
}

const SingleStatistics:React.FC<SingleStatisticsProps> = (props) => {
    const {label = "",icon = "awaitProcess"} = props;    

    const imgSrc = require("../../../../../assets/image/project-management/"+icon+".png");

    return (
        <div className={styles.singleStatistics}>
            <div className={styles.singleStatisticsTitle}>
                <div className={styles.singleStatisticsTitleWord}>
                    {label}
                </div>
                <div className={styles.singleStatisticsTitleToIcon}>
                    <RightOutlined />
                </div>
            </div>
            <div className={styles.singleStatisticsContent}>
                <div className={styles.singleStatisticsIcon}>
                    <img src={imgSrc} />
                </div>
                <div className={styles.singleStatisticsNumber}>
                    {props.children}
                </div>
                <div className={styles.singleStatisticsUnit}>
                    条
                </div>
            </div>
        </div>
    )
}

export default SingleStatistics