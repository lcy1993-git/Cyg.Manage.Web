import Loadable from 'react-loadable';
import React from 'react';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const CompanyGroup = Loadable({
  loader: () => import('@/pages/operation-config/company-group'),
  loading: Loading,
  delay: 150,
});

export default [
  {
    title: '部组管理',
    path: '/system-config/company-group',
    component: <CompanyGroup />,
  },
];
