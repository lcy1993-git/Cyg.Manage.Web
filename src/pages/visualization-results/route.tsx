import Loadable from 'react-loadable';
import React from 'react';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const ResultPage = Loadable({
    loader: () => import('@/pages/visualization-results/result-page'),
    loading: Loading,
    delay: 150,
  });

const HistoryGrid = Loadable({
  loader: () => import('@/pages/visualization-results/history-grid'),
  loading: Loading,
  delay: 150,
});

  export default [
    {
      title: '网架可视化',
      path: '/visualization-results/result-page',
      component: <ResultPage />,
    },
    {
      title: '历史网架',
      path: '/visualization-results/history-grid',
      component: <HistoryGrid />,
    },
  ];