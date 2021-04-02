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

const MapComponent = Loadable({
    loader: () => import('@/pages/index/components/map-chart'),
    loading: Loading,
    delay: 150,
});

const PersonnelLoad = Loadable({
    loader: () => import('@/pages/index/components/personnel-load'),
    loading: Loading,
    delay: 150,
});

const ToDo = Loadable({
    loader: () => import('@/pages/index/components/to-do'),
    loading: Loading,
    delay: 150,
});

const DeliveryManage = Loadable({
    loader: () => import('@/pages/index/components/delivery-manage'),
    loading: Loading,
    delay: 150,
});

const ProjectSchedule = Loadable({
    loader: () => import('@/pages/index/components/project-schedule-status'),
    loading: Loading,
    delay: 150,
});

const ProjectType = Loadable({
    loader: () => import('@/pages/index/components/project-type'),
    loading: Loading,
    delay: 150,
});

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
            configWindowHeight: 1000,
            config: []
        }
    }, [data])

    const configComponentElement = handleData.config?.map((item) => {
        return (
            <div key={item.key} data-grid={{ x: item.x, y: item.y, w: item.w, h: item.h, static: true }}>
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