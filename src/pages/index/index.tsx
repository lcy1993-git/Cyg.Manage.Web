import React, { useState } from "react";
import styles from "./index.less";
import { WidthProvider, Responsive } from 'react-grid-layout';
import bgSrc from "@/assets/image/index/bg.png";
import { useRequest, useSize } from "ahooks";
import { getChartConfig } from "@/services/operation-config/cockpit";
import { useMemo } from "react";
import { useRef } from "react";

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

import MapComponent from "@/pages/index/components/index-map-component";
import PersonnelLoad from "@/pages/index/components/index-personnel-load-component";
import ToDo from "@/pages/index/components/index-to-do-component";
import DeliveryManage from "@/pages/index/components/index-delivery-manage-component";
import ProjectSituation from "@/pages/index/components/index-project-situation-component";
import ProjectType from "@/pages/index/components/index-project-type-component";
import ProjectProgress from "@/pages/index/components/index-project-progress-component";
// import CostInformation from "./components/cost-information";
// import ProjectStatus from "./components/project-status";

import { IndexContext } from "./context";

const getComponentByType = (type: string, componentProps: any) => {
    switch (type) {
        case "toDo":
            return (
                <ToDo componentProps={componentProps} />
            )
            break;
        case "mapComponent":
            return (
                <MapComponent componentProps={componentProps} />
            )
            break;
        case "deliveryManage":
            return (
                <DeliveryManage componentProps={componentProps} />
            )
            break;
        case "personLoad":
            return (
                <PersonnelLoad componentProps={componentProps} />
            )
            break;
        case "projectSchedule":
            return (
                <ProjectSituation componentProps={componentProps} />
            )
            break;
        case "projectType":
            return (
                <ProjectType componentProps={componentProps} />
            )
            break;
        case "projectProgress":
            return (
                <ProjectProgress />
            )
            break;
        default:
            return undefined
    }
}

const Index: React.FC = () => {
    const [currentAreaId, setCurrentAreaId] = useState<string>();
    const [currentAreaLevel, setCurrentAreaLevel] = useState<"1" | "2" | "3">("1");

    const [currentAreaInfo, setCurrentAreaInfo] = useState({
        areaId: "",
        areaLevel: "1"
    })

    const { data } = useRequest(() => getChartConfig())

    const divRef = useRef<HTMLDivElement>(null);
    const size = useSize(divRef);

    const handleData = useMemo(() => {
        if (data) {
            return JSON.parse(data)
        }
        return {
            configWindowHeight: 828,
            config: []
        }
    }, [data])

    const windowPercent = useMemo(() => {
        const windowHeight = window.innerHeight;
        if (windowHeight && handleData.configWindowHeight) {
            return (windowHeight - 85) / handleData.configWindowHeight
        }
        return undefined
    }, [JSON.stringify(size), JSON.stringify(handleData)])

    const configComponentElement = handleData.config?.map((item: any) => {
        const actualHeight = windowPercent ? parseFloat((item.h * windowPercent).toFixed(2)) : item.h;
        const actualY = windowPercent ? parseFloat((item.y * windowPercent).toFixed(2)) : item.y;
        return (
            <div key={item.key} data-grid={{ x: item.x, y: actualY, w: item.w, h: actualHeight, static: true }}>
                {getComponentByType(item.name, item.componentProps)}
            </div>
        );
    });

    return (
        <IndexContext.Provider value={{
            currentAreaInfo,
            setCurrentAreaInfo
        }}>
            <div className={styles.indexPage} style={{ backgroundImage: `url(${bgSrc})` }} ref={divRef}>
                {
                    handleData.config && handleData.config.length > 0
                    &&
                    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
                        <ResponsiveReactGridLayout
                            breakpoints={{ lg: 120 }}
                            cols={{ lg: 12 }}
                            rowHeight={9}
                        >
                            {configComponentElement}
                        </ResponsiveReactGridLayout>
                    </div>
                }
            </div>
        </IndexContext.Provider>
    )
}

export default Index