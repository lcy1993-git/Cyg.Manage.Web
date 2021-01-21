import Loadable from "react-loadable";
import React from "react";
import Loading from "@ant-design/pro-layout/es/PageLoading";

const Index = Loadable({loader: () => import("@/pages/index"),loading: Loading, delay: 150})
const FunctionModule = Loadable({loader: () => import("@/pages/system-config/function-module"),loading: Loading, delay: 150})

export interface RouteListItem {
  title: string
  tabKey: string
}

interface TabRouteListItem extends RouteListItem {
  component: React.ReactNode
}

export const getTabsComponent = (key: string):TabRouteListItem => {
    let newKey = key
    if (key.includes('?')) {
      // eslint-disable-next-line prefer-destructuring
      newKey = key.split('?')[0];
    }
    let tab:TabRouteListItem = {
      title: "",
      tabKey: key,
      component: null
    }
    switch (newKey) {
      case '/index':
        tab.title = '首页'
        tab.component = <Index/>
        break;
      case '/system-config/function-module':
        tab.title = '功能模块'
        tab.component = <FunctionModule/>
        break;
    }
    return tab;
  }