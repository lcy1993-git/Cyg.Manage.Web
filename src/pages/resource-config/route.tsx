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
const Component = Loadable({
  loader: () => import('@/pages/resource-config/component'),
  loading: Loading,
  delay: 150,
});
const ElectricalEquipment = Loadable({
  loader: () => import('@/pages/resource-config/electrical-equipment'),
  loading: Loading,
  delay: 150,
});
const CableDesign = Loadable({
  loader: () => import('@/pages/resource-config/cable-design'),
  loading: Loading,
  delay: 150,
});
// const OverheadDesign = Loadable({
//   loader: () => import('@/pages/resource-config/overhead-design'),
//   loading: Loading,
//   delay: 150,
// });

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
  {
    title: '组件',
    path: '/resource-config/component',
    component: <Component />,
  },
  {
    title: '电气设备',
    path: '/resource-config/electrical-equipment',
    component: <ElectricalEquipment />,
  },
  {
    title: '电缆设计',
    path: '/resource-config/cable-design',
    component: <CableDesign />,
  },
  // {
  //   title: '架空设计',
  //   path: '/resource-config/overhead-design',
  //   component: <OverheadDesign />,
  // },
];
