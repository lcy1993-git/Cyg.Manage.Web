import Loading from '@ant-design/pro-layout/es/PageLoading'
import React from 'react'
import Loadable from 'react-loadable'

const ResultPage = Loadable({
  loader: () => import('@/pages/visualization-results/result-page'),
  loading: Loading,
  delay: 150,
})

const HistoryGrid = Loadable({
  loader: () => import('@/pages/visualization-results/history-grid'),
  loading: Loading,
  delay: 150,
})

/**
 * 注入projectId,接触新id生成时没有重新挂载的问题
 * @returns
 */
// const HashHistoryGrid = () => {
//   const { preDesignItem } = useLayoutStore()
//   return <HistoryGrid key={preDesignItem.id}/>
// }

// const GridPreDesign = Loadable({
//   loader: () => import('@/pages/visualization-results/grid-pre-design'),
//   loading: Loading,
//   delay: 150,
// })

const routes = [
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
  {
    title: '网架预设计',
    path: '/visualization-results/grid-pre-design',
    component: <HistoryGrid />,
  },
]

export default routes
