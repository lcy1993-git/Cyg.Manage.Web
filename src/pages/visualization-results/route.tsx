import Loadable from 'react-loadable';
import React from 'react';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const ResultPage = Loadable({
    loader: () => import('@/pages/visualization-results/result-page'),
    loading: Loading,
    delay: 150,
  });

  export default [
    {
      title: '可视化成果',
      path: '/visualization-results/result-page',
      component: <ResultPage />,
    },
  ];