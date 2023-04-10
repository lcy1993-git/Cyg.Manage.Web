import Loadable from 'react-loadable'
import Loading from '@ant-design/pro-layout/es/PageLoading'

const Index = Loadable({ loader: () => import('@/pages/index'), loading: Loading, delay: 150 })
const TestPage = Loadable({
  loader: () => import('@/pages/index/test-page'),
  loading: Loading,
  delay: 150,
})

export default [
  {
    title: '首页',
    path: '/index',
    component: <Index />,
  },
  {
    title: '组件测试',
    path: '/test-page',
    component: <TestPage />,
  },
]
