import React from "react";
import styles from "./index.less";
import bgSrc from "@/assets/image/index/bg.png";
import { useRequest } from "ahooks";
import { getChartConfig } from "@/services/operation-config/cockpit";
import ToDo from "./components/to-do";
import DeliveryManage from "./components/delivery-manage";
import CostInformation from "./components/cost-information";
import PersonnelLoad from "./components/personnel-load";
import ProjectStatus from "./components/project-status";
import ProjectType from "./components/project-type";
import MapChart from "./components/map-chart";
// import ScheduleStatus from "./components/project-schedule-status";
import ProjectProcess from "./components/project-process";
const Index: React.FC = () => {
    
    const {data} = useRequest(() => getChartConfig())


    console.log(JSON.parse(data ?? "{}"))

    return (
        <div className={styles.indexPage} style={{ backgroundImage: `url(${bgSrc})` }}>
            
            <div className={styles.indexPageLeft}>
                <div className={styles.toDoStatistic}>
                    <ToDo />
                </div>
                <div className={styles.leftStatisticOtherChart}>
                    <div className={styles.deliveryManage}>
                        <DeliveryManage />
                    </div>
                    <div className={styles.costInformation}>
                        <CostInformation />
                    </div>
                </div>
            </div>
            <div className={styles.indexPageCenter}>
                <div className={styles.indexPageCenterChartGl}>
                    <MapChart />
                </div>
                <div className={styles.indexPageCenterChart}>
                    <ProjectProcess />
                </div>
            </div>
            <div className={styles.indexPageRight}>
                <div className={styles.projectType}>
                    <ProjectType />
                </div>
                <div className={styles.rightStatisticOtherChart}>
                    <div className={styles.PersonnelLoad}>
                        <PersonnelLoad />
                    </div>
                    <div className={styles.ProjectStatus}>
                        <ProjectStatus />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index