import React from "react";
import styles from "./index.less";

import bgSrc from "@/assets/image/index/bg.png";

import ToDo from "./components/to-do";
import DeliveryManage from "./components/delivery-manage";
import CostInformation from "./components/cost-information";
import PersonnelLoad from "./components/personnel-load";
import ProjectPhase from "./components/project-phase";
import ProjectType from "./components/project-type";
import MapChart from "./components/map-chart";
import ProjectSchedule from "./components/project-schedule";


const Index: React.FC = () => {
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
                    <ProjectSchedule />
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
                    <div className={styles.ProjectPhase}>
                        <ProjectPhase />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index