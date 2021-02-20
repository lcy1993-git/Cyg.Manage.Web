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
const Material = Loadable({
  loader: () => import('@/pages/resource-config/material'),
  loading: Loading,
  delay: 150,
});

export default [
  {
    title: '资源库',
    path: '/resource-config/resource-lib',
    component: <ResourceLib />,
  },
  {
    title: '图纸',
    path: '/resource-config/drawing',
    component: <Drawing />,
  },
  {
    title: '物料',
    path: '/resource-config/material',
    component: <Material />,
  },
];
