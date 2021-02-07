import Loadable from 'react-loadable';
import React from 'react';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const CompanyGroup = Loadable({
  loader: () => import('@/pages/operation-config/company-group'),
  loading: Loading,
  delay: 150,
});
const CompanyFile = Loadable({
  loader: () => import('@/pages/operation-config/company-file'),
  loading: Loading,
  delay: 150,
});

export default [
  {
    title: '部组管理',
    path: '/operation-config/company-group',
    component: <CompanyGroup />,
  },
  {
    title: '公司文件',
    path: '/operation-config/company-file',
    component: <CompanyFile />,
  },
];
