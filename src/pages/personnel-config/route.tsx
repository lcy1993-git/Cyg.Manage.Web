import Loadable from 'react-loadable';
import React from 'react';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const ManageUser = Loadable({
  loader: () => import('@/pages/personnel-config/manage-user'),
  loading: Loading,
  delay: 150,
});

const CompanyUser = Loadable({
  loader: () => import('@/pages/personnel-config/company-user'),
  loading: Loading,
  delay: 150,
});

const UserFeedBack = Loadable({
  loader: () => import('@/pages/personnel-config/feedback'),
  loading: Loading,
  delay: 150,
});

export default [
  {
    title: '管理用户',
    path: '/personnel-config/manage-user',
    component: <ManageUser />,
  },
  {
    title: '公司用户',
    path: '/personnel-config/company-user',
    component: <CompanyUser />,
  },
  {
    title: '用户反馈',
    path: '/personnel-config/feedback',
    component: <UserFeedBack />,
  },
];
