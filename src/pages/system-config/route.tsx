import Loadable from 'react-loadable';
import React from 'react';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const FunctionModule = Loadable({
  loader: () => import('@/pages/system-config/function-module'),
  loading: Loading,
  delay: 150,
});
const LogManage = Loadable({
  loader: () => import('@/pages/system-config/log-manage'),
  loading: Loading,
  delay: 150,
});

const DictionaryManage = Loadable({
  loader: () => import('@/pages/system-config/dictionary-manage'),
  loading: Loading,
  delay: 150,
});

const ElectricCompany = Loadable({
  loader: () => import('@/pages/system-config/electric-company'),
  loading: Loading,
  delay: 150,
});
const ReportLog = Loadable({
  loader: () => import('@/pages/system-config/report-log'),
  loading: Loading,
  delay: 150,
});

export default [
  {
    title: '功能管理',
    path: '/system-config/function-module',
    component: <FunctionModule />,
  },
  {
    title: '日志管理',
    path: '/system-config/log-manage',
    component: <LogManage />,
  },
  {
    title: '字典管理',
    path: '/system-config/dictionary-manage',
    component: <DictionaryManage />,
  },
  {
    title: '电力公司',
    path: '/system-config/electric-company',
    component: <ElectricCompany />,
  },
  {
    title: '上报日志',
    path: '/system-config/report-log',
    component: <ReportLog />,
  },
];
