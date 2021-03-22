import PageCommonWrap from "@/components/page-common-wrap";
import React, { useState } from "react";
import { WidthProvider, Responsive } from "react-grid-layout";

import Loadable from 'react-loadable';
import Loading from '@ant-design/pro-layout/es/PageLoading';

import "./index.less";

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

const ProjectCategory = Loadable({
    loader: () => import('@/pages/index/components/project-category'),
    loading: Loading,
    delay: 150,
});



const CockpitManage: React.FC = () => {
    const [widgets, setWidgets] = useState<any[]>([]);

    const pageElement = widgets.map((item) => {

    })

    return (
        <PageCommonWrap>
            <ResponsiveReactGridLayout
                className="layout"

                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            >
                <div key={1}>
                    <MapComponent key="1" />
                </div>
                <div key="2">
                    <PersonnelLoad />
                </div>
                <div key="3">
                    <ProjectCategory />
                </div>
            </ResponsiveReactGridLayout>
        </PageCommonWrap>
    )
}

export default CockpitManage