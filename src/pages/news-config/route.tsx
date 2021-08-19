import Loadable from 'react-loadable';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const ReviewManage = Loadable({
  loader: () => import('@/pages/news-config/review-manage'),
  loading: Loading,
  delay: 150,
});

export default [
  {
    title: '审阅管理 ',
    path: '/news-config/review-manage',
    component: <ReviewManage />,
  },
];
