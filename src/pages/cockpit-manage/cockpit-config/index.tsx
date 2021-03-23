import PageCommonWrap from "@/components/page-common-wrap";
import React, { useState } from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import Loadable from 'react-loadable';
import Loading from '@ant-design/pro-layout/es/PageLoading';
import bgSrc from "@/assets/image/index/bg.png";
import CommonTitle from "@/components/common-title";
import { Button } from "antd";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./index.less";

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

const CostInformation = Loadable({
    loader: () => import('@/pages/index/components/cost-information'),
    loading: Loading,
    delay: 150,
});

const ProjectStatus = Loadable({
    loader: () => import('@/pages/index/components/project-status'),
    loading: Loading,
    delay: 150,
});

const ProjectType = Loadable({
    loader: () => import('@/pages/index/components/project-type'),
    loading: Loading,
    delay: 150,
});

const ProjectSchedule = Loadable({
    loader: () => import('@/pages/index/components/project-schedule'),
    loading: Loading,
    delay: 150,
});

const CockpitManage: React.FC = () => {

    return (
        <PageCommonWrap noPadding={true}>
            <div className={styles.cockpitConfigPage}>
                <div className={styles.cockpitConfigPageTitle}>
                    <div className={styles.cockpitConfigPageTitleLeft}>
                        <CommonTitle noPadding={true}>统计图表自定义窗口</CommonTitle>
                    </div>
                    <div className={styles.cockpitConfigPageTitleRight}>
                        <Button className="mr7">导出数据</Button>
                        <Button className="mr7">恢复默认配置</Button>
                        <Button>清空当前配置</Button>
                    </div>
                </div>
                <div className={styles.cockpitConfigPageContent} style={{ backgroundImage: `url(${bgSrc})` }}>
                    <ResponsiveReactGridLayout
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                        rowHeight={30}
                    >
                        <div key="1">
                            <MapComponent />
                        </div>
                        <div key="2">
                            <PersonnelLoad />
                        </div>
                        <div key="3">
                            <ToDo />
                        </div>
                        <div key="4">
                            <DeliveryManage />
                        </div>
                        <div key="5">
                            <CostInformation />
                        </div>
                        <div key="6">
                            <ProjectStatus />
                        </div>
                        <div key="7">
                            <ProjectType />
                        </div>
                        <div key="8">
                            <ProjectSchedule />
                        </div>
                    </ResponsiveReactGridLayout>
                </div>
            </div>
        </PageCommonWrap>
    )
}

export default CockpitManage