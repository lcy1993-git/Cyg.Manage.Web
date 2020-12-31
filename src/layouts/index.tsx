import React, { useState, useEffect } from "react"
import { IRouteComponentProps } from 'umi'
import { Tabs,ConfigProvider } from "antd";
import LayoutHeader from './components/layout-header'
import {getTabsComponent} from "@/utils/tabs-config.tsx"
import zhCN from 'antd/lib/locale/zh_CN';

const { TabPane } = Tabs;

const Layout: React.FC<IRouteComponentProps> = ({ children, location, route, history, match }) => {
    const [activeKey, setActiveKey] = useState<string>("/index");
    const [routeList, setRouteList] = useState<any[]>([]);

    useEffect(() => {
        const historyRoutes = JSON.parse(JSON.stringify(routeList));
        const routeIndex = historyRoutes.findIndex((item) => item.tabKey === location.pathname + "" + location.search);
        if (routeIndex > -1) {
            setActiveKey(historyRoutes[routeIndex].tabKey)
        } else {
            historyRoutes.push({
                ...location,
                tabKey: `${location.pathname}${location.search}`,
                title: location.pathname
            });
            setRouteList(historyRoutes);
            setActiveKey(`${location.pathname}${location.search}`)
        }

    }, [JSON.stringify(location)])

    const routeShowElement = routeList.map((item) => {
        const tabsInfo = getTabsComponent(item.tabKey);
        return (
            <TabPane key={item.tabKey} tab={<span>{tabsInfo.title}</span>}>
                {
                    tabsInfo.component
                }
            </TabPane>
        )
    })

    const tabChangeEvent = (key) => {
        setActiveKey(key)
    }

    const editTabsEvent = (key: string | React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>, action: "add" | "remove") => {
        const copyRouteList = routeList.map((item) => item);
        const keyIndex = copyRouteList.findIndex((item) => item.tabKey === key);

        // 判断他当前删除的是不是当前激活的tab,如果是，则需要激活这个tab的相邻的tab,如果不是，就直接删除
        let needActiveIndex = 0;
        if (activeKey === key) {
            if (copyRouteList.length > 1 && keyIndex === copyRouteList.length - 1) {
                needActiveIndex = keyIndex - 1;
                setActiveKey(copyRouteList[needActiveIndex].tabKey);
            } else if (copyRouteList.length > 1 && keyIndex === 0) {
                needActiveIndex = keyIndex + 1;
                setActiveKey(copyRouteList[needActiveIndex].id);
            }
        }

        if(keyIndex > -1) {
            copyRouteList.splice(keyIndex,1);
        }
        setRouteList(copyRouteList);
    }

    return (
        <ConfigProvider locale={zhCN}>
            <LayoutHeader />
            <Tabs hideAdd defaultActiveKey="/index" onEdit={editTabsEvent} type="editable-card" onChange={tabChangeEvent} activeKey={activeKey}>
                {routeShowElement}
            </Tabs>
        </ConfigProvider>
    )
}

export default Layout
