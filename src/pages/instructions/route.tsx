import Loadable from 'react-loadable';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const Instructions = Loadable({
  loader: () => import('@/pages/instructions'),
  loading: Loading,
  delay: 150,
});

export default [
  {
    title: '说明书',
    path: '/instructions',
    component: <Instructions />,
  }
]