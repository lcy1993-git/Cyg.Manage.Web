import Loadable from 'react-loadable';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const UserFeedBack = Loadable({
  loader: () => import('@/pages/system-config/feedback'),
  loading: Loading,
  delay: 150,
});

export default [
  {
    title: '异常反馈',
    path: '/system-config/feedback',
    component: <UserFeedBack />,
  },
];
