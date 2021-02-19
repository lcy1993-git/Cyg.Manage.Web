import Loadable from 'react-loadable';
import React from 'react';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const ResourceLib = Loadable({
  loader: () => import('@/pages/resource-config/resource-lib'),
  loading: Loading,
  delay: 150,
});
const Drawing = Loadable({
  loader: () => import('@/pages/resource-config/drawing'),
  loading: Loading,
  delay: 150,
});

export default [
  {
    title: '资源库',
    path: '/pages/resource-manage/resource-lib',
    component: <ResourceLib />,
  },
  {
    title: '图纸',
    path: '/pages/resource-config/drawing',
    component: <Drawing />,
  },
];
