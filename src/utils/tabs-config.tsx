import React from 'react'

import IndexRoute from '@/pages/index/route'
import AdminIndexRoute from '@/pages/adminIndex/route'
import BackStageConfigRoutes from '@/pages/backstage-config/route'
import JurisdictionConfig from '@/pages/jurisdiction-config/route'
import SystemConfig from '@/pages/system-config/route'
import StandardConfig from '@/pages/standard-config/route'
import NoJurisdiction from '@/pages/401/route'
import ProjectManagement from '@/pages/project-management/route'
import MaterialConfig from '@/pages/material-config/route'
import VisualizationResults from '@/pages/visualization-results/route'
import NewsConfig from '@/pages/news-config/route'
import CockpitManage from '@/pages/cockpit-manage/route'
import AgainLogin from '@/pages/again-login/route'
import TechnologyEconomics from '@/pages/technology-economic/route'

export interface RouteListItem {
  title: string
  path?: string
  tabKey?: string
}

interface TabRouteListItem extends RouteListItem {
  component: React.ReactNode
}

const routeList: TabRouteListItem[] = [
  ...IndexRoute,
  ...AdminIndexRoute,
  ...BackStageConfigRoutes,
  ...JurisdictionConfig,
  ...SystemConfig,
  ...StandardConfig,
  ...NoJurisdiction,
  ...ProjectManagement,
  ...MaterialConfig,
  ...VisualizationResults,
  ...NewsConfig,
  ...CockpitManage,
  ...AgainLogin,
  ...TechnologyEconomics,
]

export const getTabsComponent = (key: string): TabRouteListItem => {
  let newKey = key
  if (key.includes('?')) {
    // eslint-disable-next-line prefer-destructuring
    newKey = key.split('?')[0]
  }
  const itemInArray = routeList.find((item) => item.path === newKey)
  if (!itemInArray) {
    return {
      title: '404',
      path: '/404',
      component: null,
    }
  }
  return itemInArray
}
