import React from 'react';

import IndexRoute from '@/pages/index/route';
import SystemConfigRoutes from '@/pages/system-config/route';
import JurisdictionConfig from '@/pages/jurisdiction-config/route';
import PersonnelConfig from '@/pages/personnel-config/route';
import OperationConfig from '@/pages/operation-config/route';
import ResourceConfig from '@/pages/resource-config/route';
import NoJurisdiction from '@/pages/401/route';
import ProjectManagement from '@/pages/project-management/route';
import VisualizationResults from "@/pages/visualization-results/route"

export interface RouteListItem {
  title: string;
  path?: string;
  tabKey?: string;
}

interface TabRouteListItem extends RouteListItem {
  component: React.ReactNode;
}

const routeList: TabRouteListItem[] = [
  ...IndexRoute,
  ...SystemConfigRoutes,
  ...JurisdictionConfig,
  ...PersonnelConfig,
  ...OperationConfig,
  ...ResourceConfig,
  ...NoJurisdiction,
  ...ProjectManagement,
  ...VisualizationResults
];

export const getTabsComponent = (key: string): TabRouteListItem => {
  let newKey = key;
  if (key.includes('?')) {
    // eslint-disable-next-line prefer-destructuring
    newKey = key.split('?')[0];
  }
  const itemInArray = routeList.find((item) => item.path === newKey);
  if (!itemInArray) {
    return {
      title: '404',
      path: '/404',
      component: null,
    };
  }
  return itemInArray;
};
