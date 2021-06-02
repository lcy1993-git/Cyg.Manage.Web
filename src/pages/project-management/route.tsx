import Loadable from 'react-loadable';
import React from 'react';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const AllProject = Loadable({
  loader: () => import('@/pages/project-management/all-project'),
  loading: () => <Loading />,
  delay: 150,
});

const ProjectStatistics = Loadable({
  loader: () => import('@/pages/project-management/project-statistics'),
  loading: () => <Loading />,
  delay: 150,
});

const ProjectGantt = Loadable({
  loader: () => import('@/pages/project-management/project-gantt'),
  loading: () => <Loading />,
  delay: 150,
});

export default [
  {
    title: '所有项目',
    path: '/project-management/all-project',
    component: <AllProject />,
  },
  {
    title: '地州项目一览表',
    path: '/project-management/project-statistics',
    component: <ProjectStatistics />,
  },
  {
    title: '甘特图',
    path: '/project-management/project-gantt',
    component: <ProjectGantt />,
  },
]                                                                                                                                                                                                                                      
