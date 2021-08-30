import Loadable from 'react-loadable';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const CockpitConfig = Loadable({
  loader: () => import('@/pages/cockpit-manage/cockpit-config'),
  loading: Loading,
  delay: 150,
});

export default [
  {
    title: '首页配置',
    path: '/cockpit-manage/cockpit-config',
    component: <CockpitConfig />,
  },
];
