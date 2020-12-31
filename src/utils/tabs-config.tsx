import Loadable from "react-loadable";
import React from "react";
import Loading from "@ant-design/pro-layout/es/PageLoading";

const Index = Loadable({loader: () => import("@/pages/index"),loading: Loading, delay: 150})
const Login = Loadable({loader: () => import("@/pages/login"),loading: Loading, delay: 150})


export const getTabsComponent = (key: string) => {
    let newKey = key
    if (key.includes('?')) {
      // eslint-disable-next-line prefer-destructuring
      newKey = key.split('?')[0];
    }
    const tab = {}
    switch (newKey) {
      case '/index':
        tab.title = '首页'
        tab.component = <Index/>
        break;
      case '/login':
        tab.title = '登录 '
        tab.component = <Login />
        break;
      default :
        tab.title = '首页'
        tab.component = <Index/>
        break;
    }
    return tab;
  }