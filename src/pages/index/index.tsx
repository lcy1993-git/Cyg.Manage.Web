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
import { Spin } from "antd";
import { divide, multiply, subtract } from "lodash";
import uuid from "node-uuid";

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

    const [currentAreaInfo, setCurrentAreaInfo] = useState({
        areaId: "",
        areaLevel: "1"
    })

    const [configWindowHeight, setConfigWindowHeight] = useState<number>(828);
    const [configArray, setConfigArray] = useState<any[]>([])

    const { data, loading } = useRequest(() => getChartConfig(), {
        onSuccess: () => {
            if (data) {
                const hasSaveConfig = JSON.parse(data);
                if (hasSaveConfig.config && hasSaveConfig.config.length > 0) {
                    setConfigArray(hasSaveConfig.config)
                }
                if (hasSaveConfig.configWindowHeight) {
                    setConfigWindowHeight(hasSaveConfig.configWindowHeight)
                }
            } else {
                const thisBoxHeight = configWindowHeight - 155;
                const totalHeight = divide(thisBoxHeight, 18);
                setConfigArray([
                    { name: 'toDo', x: 0, y: 0, w: 3, h: 11, key: uuid.v1() },
                    {
                        name: 'mapComponent',
                        x: 3,
                        y: 0,
                        w: 6,
                        h: subtract(totalHeight, divide(totalHeight - 11, 2)),
                        key: uuid.v1(),
                    },
                    { name: 'projectType', x: 9, y: 0, w: 3, h: 11, key: uuid.v1() },
                    { name: 'deliveryManage', x: 0, y: 10, w: 3, h: divide(totalHeight - 11, 2), key: uuid.v1() },
                    { name: 'personLoad', x: 9, y: 10, w: 3, h: divide(totalHeight - 11, 2), key: uuid.v1() },
                    {
                        name: 'projectSchedule',
                        x: 0,
                        y: divide(totalHeight - 11, 2) + 10,
                        w: 6,
                        h: divide(totalHeight - 11, 2),
                        key: uuid.v1(),
                    },
                    {
                        name: 'projectProgress',
                        x: 6,
                        y: divide(totalHeight - 11, 2) + 10,
                        w: 6,
                        h: divide(totalHeight - 11, 2),
                        key: uuid.v1(),
                    },
                ]);
            }
        }
    })

    const divRef = useRef<HTMLDivElement>(null);
    const size = useSize(divRef);


    const windowPercent = useMemo(() => {
        const windowHeight = window.innerHeight;
        if (windowHeight && configWindowHeight) {
            return (windowHeight - 85) / configWindowHeight
        }
        return undefined
    }, [JSON.stringify(size), configWindowHeight])

    const configComponentElement = configArray?.map((item: any) => {
        const actualHeight = windowPercent ? multiply(item.h,windowPercent) : item.h;
        const actualY = windowPercent ? multiply(item.y,windowPercent) : item.y;
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
                    !loading &&
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
            {
                loading &&
                <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
                    <Spin spinning={loading} tip="正在载入中..."></Spin>
                </div>
            }
        </IndexContext.Provider>
    )
}

export default Index