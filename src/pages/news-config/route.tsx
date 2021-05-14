import Loadable from 'react-loadable';
import React from 'react';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const InfoManage = Loadable({
  loader: () => import('@/pages/news-config/info-manage'),
  loading: Loading,
  delay: 150,
});

const ReviewManage = Loadable({
  loader: () => import('@/pages/news-config/review-manage'),
  loading: Loading,
  delay: 150,
});

export default [
  {
    title: '宣贯管理',
    path: '/news-config/info-manage',
    component: <InfoManage />,
  },
  {
    title: '审阅管理 ',
    path: '/news-config/review-manage',
    component: <ReviewManage />,
  },
];
