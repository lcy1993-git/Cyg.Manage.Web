import Loadable from 'react-loadable';
import React from 'react';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const ManageUser = Loadable({
  loader: () => import('@/pages/personnel-config/manage-user'),
  loading: Loading,
  delay: 150,
});

export default [
  {
    title: '管理用户',
    path: '/personnel-config/manage-user',
    component: <ManageUser />,
  },
];
