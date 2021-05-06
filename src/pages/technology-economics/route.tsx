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
];