import Loadable from 'react-loadable';
import Loading from '@ant-design/pro-layout/es/PageLoading';
import ManualManagement from "@/pages/backstage-config/manual-management";

const FunctionModule = Loadable({
  loader: () => import('@/pages/backstage-config/function-module'),
  loading: Loading,
  delay: 150,
});
const LogManage = Loadable({
  loader: () => import('@/pages/backstage-config/log-manage'),
  loading: Loading,
  delay: 150,
});

const DictionaryManage = Loadable({
  loader: () => import('@/pages/backstage-config/dictionary-manage'),
  loading: Loading,
  delay: 150,
});

const ElectricCompany = Loadable({
  loader: () => import('@/pages/backstage-config/electric-company'),
  loading: Loading,
  delay: 150,
});
const ReportLog = Loadable({
  loader: () => import('@/pages/backstage-config/report-log'),
  loading: Loading,
  delay: 150,
});
const FeedBack = Loadable({
  loader: () => import('@/pages/backstage-config/platform-feedback'),
  loading: Loading,
  delay: 150,
});
const MapField = Loadable({
  loader: () => import('@/pages/backstage-config/map-field'),
  loading: Loading,
  delay: 150,
});
// const TerminalUnit = Loadable({
//   loader: () => import('@/pages/backstage-config/terminal-unit'),
//   loading: Loading,
//   delay: 150,
// });
const BasicData = Loadable({
  loader: () => import('@/pages/backstage-config/basic-data'),
  loading: Loading,
  delay: 150,
});

export default [
  {
    title: '功能管理',
    path: '/backstage-config/function-module',
    component: <FunctionModule />,
  },
  {
    title: '日志管理',
    path: '/backstage-config/log-manage',
    component: <LogManage />,
  },
  {
    title: '字典管理',
    path: '/backstage-config/dictionary-manage',
    component: <DictionaryManage />,
  },
  {
    title: '电力公司',
    path: '/backstage-config/electric-company',
    component: <ElectricCompany />,
  },
  {
    title: '上报日志',
    path: '/backstage-config/report-log',
    component: <ReportLog />,
  },
  {
    title: '平台反馈',
    path: '/backstage-config/platform-feedback',
    component: <FeedBack />,
  },
  {
    title: '数据映射',
    path: '/backstage-config/map-field',
    component: <MapField />,
  },
  // {
  //   title: '终端设备',
  //   path: '/backstage-config/terminal-unit',
  //   component: <TerminalUnit />,
  // },

  {
    title: '基础数据',
    path: '/backstage-config/basic-data',
    component: <BasicData />,
  },  {
    title: '说明书管理',
    path: '/backstage-config/manual-management',
    component: <ManualManagement />,
  },
];
