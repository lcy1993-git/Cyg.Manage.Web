import Loadable from 'react-loadable';
// @ts-ignore
import React from 'react';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const AdminIndexHome = Loadable({
  loader: () => import('@/pages/adminIndex/home/index'),
  loading: Loading,
  delay: 150,
});
export default [
  {
    title: '安全审计',
    path: '/admin-index/home',
    component: <AdminIndexHome />,
  },
]
