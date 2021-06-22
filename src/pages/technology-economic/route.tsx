import Loadable from 'react-loadable';
import React from 'react';
import Loading from '@ant-design/pro-layout/es/PageLoading';

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
];
