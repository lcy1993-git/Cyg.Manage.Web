import Loadable from 'react-loadable';
import React from 'react';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const CompanyManage = Loadable({
  loader: () => import('@/pages/jurisdiction-config/company-manage'),
  loading: Loading,
  delay: 150,
});
const PlatformRole = Loadable({
  loader: () => import('@/pages/jurisdiction-config/platform-role'),
  loading: Loading,
  delay: 150,
});

export default [
  {
    title: '公司管理',
    path: '/jurisdiction-config/company-manage',
    component: <CompanyManage />,
  },
  {
    title: '平台角色',
    path: '/jurisdiction-config/platform-role',
    component: <PlatformRole />,
  },
];
