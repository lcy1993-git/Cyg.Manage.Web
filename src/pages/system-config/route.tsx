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
const FeedBack = Loadable({
  loader: () => import('@/pages/system-config/platform-feedback'),
  loading: Loading,
  delay: 150,
});
const MapField = Loadable({
  loader: () => import('@/pages/system-config/map-field'),
  loading: Loading,
  delay: 150,
});
const TerminalUnit = Loadable({
  loader: () => import('@/pages/system-config/terminal-unit'),
  loading: Loading,
  delay: 150,
});
const BasicData = Loadable({
  loader: () => import('@/pages/system-config/basic-data'),
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
  {
    title: '平台反馈',
    path: '/system-config/platform-feedback',
    component: <FeedBack />,
  },
  {
    title: '数据映射',
    path: '/system-config/map-field',
    component: <MapField />,
  },
  {
    title: '终端设备',
    path: '/system-config/terminal-unit',
    component: <TerminalUnit />,
  },
  {
    title: '终端设备',
    path: '/system-config/terminal-unit',
    component: <TerminalUnit />,
  },
  {
    title: '基础数据',
    path: '/system-config/basic-data',
    component: <BasicData />,
  },
];
