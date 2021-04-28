import Loadable from 'react-loadable';
import React from 'react';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const AgainLogin = Loadable({
  loader: () => import('@/pages/again-login'),
  loading: Loading,
  delay: 150,
});

export default [
  {
    title: '快捷登录',
    path: '/again-login',
    component: <AgainLogin />,
  },
]     