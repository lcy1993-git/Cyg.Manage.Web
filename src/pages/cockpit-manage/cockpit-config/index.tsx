import PageCommonWrap from "@/components/page-common-wrap";
import React, { useState } from "react";
import { WidthProvider, Responsive } from "react-grid-layout";

import "./index.less";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

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
                <div key="1">1</div>
                <div key="2">2</div>
                <div key="3">3</div>
            </ResponsiveReactGridLayout>
        </PageCommonWrap>
    )
}

export default CockpitManage