import Loadable from 'react-loadable';
import React from 'react';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const InfoManage = Loadable({
  loader: () => import('@/pages/news-config/info-manage'),
  loading: Loading,
  delay: 150,
});

export default [
  {
    title: '资讯管理',
    path: '/news-config/info-manage',
    component: <InfoManage />,
  },
];
