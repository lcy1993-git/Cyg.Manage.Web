import React from "react";
import styles from "./index.less";
import Loadable from 'react-loadable';
import Loading from '@ant-design/pro-layout/es/PageLoading';
import { WidthProvider, Responsive } from 'react-grid-layout';
import bgSrc from "@/assets/image/index/bg.png";
import { useRequest, useSize } from "ahooks";
import { getChartConfig } from "@/services/operation-config/cockpit";
import { useMemo } from "react";
import { useRef } from "react";

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);


import MapComponent from "@/pages/index/components/map-chart";
import PersonnelLoad from "@/pages/index/components/personnel-load";
import ToDo from "@/pages/index/components/to-do";
import DeliveryManage from "@/pages/index/components/delivery-manage";
import ProjectSchedule from "@/pages/index/components/project-schedule-status";
import ProjectType from "@/pages/index/components/project-type";
import ProjectProgress from "@/pages/index/components/project-progress";

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
                <ProjectSchedule componentProps={componentProps} />
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

    console.log(handleData)

    const windowPercent = useMemo(() => {
        const windowHeight = window.innerHeight;
        if (windowHeight && handleData.configWindowHeight) {
            return (windowHeight - 85) / handleData.configWindowHeight
        }
        return undefined
    }, [JSON.stringify(size), JSON.stringify(handleData)])

    const configComponentElement = handleData.config?.map((item) => {
        const actualHeight = windowPercent ? parseFloat((item.h * windowPercent).toFixed(2)) : item.h;
        const actualY = windowPercent ? parseFloat((item.y * windowPercent).toFixed(2)) : item.y;
        return (
            <div key={item.key} data-grid={{ x: item.x, y: actualY, w: item.w, h: actualHeight, static: true }}>
                {getComponentByType(item.name, item.componentProps)}
            </div>
        );
    });

    return (
        <div className={styles.indexPage} style={{ backgroundImage: `url(${bgSrc})` }} ref={divRef}>
            <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
                <ResponsiveReactGridLayout
                    breakpoints={{ lg: 120 }}
                    cols={{ lg: 12 }}
                    rowHeight={9}
                >
                    {configComponentElement}
                </ResponsiveReactGridLayout>
            </div>
        </div>
    )
}

export default Index