import Loading from '@ant-design/pro-layout/es/PageLoading'
import Loadable from 'react-loadable'

const AllProject = Loadable({
  loader: () => import('@/pages/project-management/my-work/index'),
  loading: () => <Loading />,
  delay: 150,
})

const ProjectStatistics = Loadable({
  loader: () => import('@/pages/project-management/project-statistics'),
  loading: () => <Loading />,
  delay: 150,
})

const ProjectGantt = Loadable({
  loader: () => import('@/pages/project-management/project-gantt'),
  loading: () => <Loading />,
  delay: 150,
})

const ProjectAllAreaStatistics = Loadable({
  loader: () => import('@/pages/project-management/project-all-area-statistics'),
  loading: () => <Loading />,
  delay: 150,
})

const ProjectDetail = Loadable({
  loader: () => import('@/pages/project-management/project-detail'),
  loading: () => <Loading />,
  delay: 150,
})

const ProjectNotice = Loadable({
  loader: () => import('@/pages/project-management/project-notice'),
  loading: () => <Loading />,
  delay: 150,
})

const ProjectMonitor = Loadable({
  loader: () => import('@/pages/project-management/project-monitor'),
  loading: () => <Loading />,
  delay: 150,
})

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    title: '我的工作台',
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
  {
    title: '项目一览表',
    path: '/project-management/project-all-area-statistics',
    component: <ProjectAllAreaStatistics />,
  },
  {
    title: '项目明细表',
    path: '/project-management/project-detail',
    component: <ProjectDetail />,
  },
  {
    title: '全过程通报',
    path: '/project-management/project-notice',
    component: <ProjectNotice />,
  },
  {
    title: '项目情况监控',
    path: '/project-management/project-monitor',
    component: <ProjectMonitor />,
  },
]
