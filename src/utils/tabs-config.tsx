import React from "react";

import IndexRoute from "@/pages/index/route"
import SystemConfigRoutes from "@/pages/system-config/route";
import JurisdictionConfig from "@/pages/jurisdiction-config/route";

export interface RouteListItem {
  title: string
  path: string
}

interface TabRouteListItem extends RouteListItem {
  component: React.ReactNode
}

const routeList:TabRouteListItem[] = [
  ...IndexRoute,
  ...SystemConfigRoutes,
  ...JurisdictionConfig
]

export const getTabsComponent = (key: string): TabRouteListItem => {
  let newKey = key
  if (key.includes('?')) {
    // eslint-disable-next-line prefer-destructuring
    newKey = key.split('?')[0];
  }
  const itemInArray = routeList.find((item) => item.path === newKey);
  if(!itemInArray) {
    return {
      title: "404",
      path: "/404",
      component: null
    }
  }
  return itemInArray
}