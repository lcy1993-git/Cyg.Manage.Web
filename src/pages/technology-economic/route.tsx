import Loadable from 'react-loadable';
// @ts-ignore
import React from 'react';
import Loading from '@ant-design/pro-layout/es/PageLoading';
import CostTemplate from './cost-template';
import TotalTable from './total-table';
import UsualQuotaTable from './usual-quota-table';
import UsualQuotaTableDetail from './usual-quota-table/components/detail';

const QuotaLibrary = Loadable({
  loader: () => import('@/pages/technology-economic/quota-library'),
  loading: Loading,
  delay: 150,
});
const QuotaInfomation = Loadable({
  loader: () => import('@/pages/technology-economic/quota-infomation'),
  loading: Loading,
  delay: 150,
});
const MaterialLibrary = Loadable({
  loader: () => import('@/pages/technology-economic/material-library'),
  loading: Loading,
  delay: 150,
});
const MaterialInfomation = Loadable({
  loader: () => import('@/pages/technology-economic/material-infomation'),
  loading: Loading,
  delay: 150,
});
const PricingTemplates = Loadable({
  loader: () => import('@/pages/technology-economic/pricing-templates'),
  loading: Loading,
  delay: 150,
});
const CommonRate = Loadable({
  loader: () => import('@/pages/technology-economic/common-rate'),
  loading: Loading,
  delay: 150,
});
const ProjectList = Loadable({
  loader: () => import('@/pages/technology-economic/project-list'),
  loading: Loading,
  delay: 150,
});
const CommonRateInfomation = Loadable({
  loader: () => import('@/pages/technology-economic/common-rate-infomation'),
  loading: Loading,
  delay: 150,
});

export default [
  {
    title: '定额库',
    path: '/technology-economic/quota-library',
    component: <QuotaLibrary />,
  },
  {
    title: '查看定额库',
    path: '/technology-economic/quota-infomation',
    component: <QuotaInfomation />,
  },
  {
    title: '材机库',
    path: '/technology-economic/material-library',
    component: <MaterialLibrary />,
  },
  {
    title: '查看材机库',
    path: '/technology-economic/material-infomation',
    component: <MaterialInfomation />,
  },
  {
    title: '计价模板',
    path: '/technology-economic/pricing-templates',
    component: <PricingTemplates />,
  },
  {
    title: '常用费率',
    path: '/technology-economic/common-rate',
    component: <CommonRate />,
  },
  {
    title: '费率详情',
    path: '/technology-economic/common-rate-infomation',
    component: <CommonRateInfomation />,
  },
  {
    title: '工程目录',
    path: '/technology-economic/project-list',
    component: <ProjectList />,
  },
  {
    title: '费用模板',
    path: '/technology-economic/cost-template',
    component: <CostTemplate />,
  },

  {
    title: '总算表',
    path: '/technology-economic/total-table',
    component: <TotalTable />,
  },
  {
    title: '定额常用表',
    path: '/technology-economic/usual-quota-table',
    component: <UsualQuotaTable />,
  },
  {
    title: '定额常用表详情',
    path: '/technology-economic/usual-quota-table/detail',
    component: <UsualQuotaTableDetail />,
  },
];
