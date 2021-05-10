import Loadable from 'react-loadable';
import React from 'react';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const QuotaLibrary = Loadable({
  loader: () => import('@/pages/technology-economics/quota-library'),
  loading: Loading,
  delay: 150,
});
const QuotaList = Loadable({
  loader: () => import('@/pages/technology-economics/quota-list'),
  loading: Loading,
  delay: 150,
});
const QuotaProject = Loadable({
  loader: () => import('@/pages/technology-economics/quota-project'),
  loading: Loading,
  delay: 150,
});
const QuotaMachanics = Loadable({
  loader: () => import('@/pages/technology-economics/quota-mechanics'),
  loading: Loading,
  delay: 150,
});
const QuotaMaterial = Loadable({
  loader: () => import('@/pages/technology-economics/quota-material'),
  loading: Loading,
  delay: 150,
});
const QuotaLabour = Loadable({
  loader: () => import('@/pages/technology-economics/quota-labour'),
  loading: Loading,
  delay: 150,
});

export default [
  {
    title: '定额库',
    path: '/technology-economics/quota-library',
    component: <QuotaLibrary />,
  },
  {
    title: '定额库目录',
    path: '/technology-economics/quota-list',
    component: <QuotaList />,
  },
  {
    title: '定额项',
    path: '/technology-economics/quota-project',
    component: <QuotaProject />,
  },
  {
    title: '定额库机械项',
    path: '/technology-economics/quota-mechanics',
    component: <QuotaMachanics />,
  },
  {
    title: '定额库材料项',
    path: '/technology-economics/quota-material',
    component: <QuotaMaterial />,
  },
  {
    title: '定额库人工项',
    path: '/technology-economics/quota-labour',
    component: <QuotaLabour />,
  },
];