import Loading from '@ant-design/pro-layout/es/PageLoading'
import Loadable from 'react-loadable'

const ResultPage = Loadable({
  loader: () => import('@/pages/visualization-results/result-page'),
  loading: Loading,
  delay: 150,
})

// const HistoryGrid = Loadable({
//   loader: () => import('@/pages/visualization-results/history-grid'),
//   loading: Loading,
//   delay: 150,
// })

/**
 * 网架管理
 */
const GridManage = Loadable({
  loader: () => import('@/pages/visualization-results/grid-manage'),
  loading: Loading,
  delay: 150,
})

/**
 * 网架规划
 */
const PlanManage = Loadable({
  loader: () => import('@/pages/visualization-results/plan-manage'),
  loading: Loading,
  delay: 150,
})

/**
 * 注入projectId,接触新id生成时没有重新挂载的问题
 * @returns
 */
// const HashHistoryGrid = () => {
//   const { preDesignItem } = useLayoutStore()
//   return <HistoryGrid key={preDesignItem.id} />
// }

const routes = [
  {
    title: '在建网架',
    path: '/visualization-results/result-page',
    component: <ResultPage />,
  },
  // {
  //   title: '历史网架',
  //   path: '/visualization-results/history-grid',
  //   component: <HistoryGrid />,
  // },
  {
    title: '历史网架',
    path: '/visualization-results/grid-manage',
    component: <GridManage />,
  },
  {
    title: '规划网架',
    path: '/visualization-results/plan-manage',
    component: <PlanManage />,
  },
]

export default routes
