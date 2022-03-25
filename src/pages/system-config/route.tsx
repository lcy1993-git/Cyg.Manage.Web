import Loadable from 'react-loadable'
import Loading from '@ant-design/pro-layout/es/PageLoading'

const UserFeedBack = Loadable({
  loader: () => import('@/pages/system-config/feedback'),
  loading: Loading,
  delay: 150,
})

const CustomMap = Loadable({
  loader: () => import('@/pages/system-config/custom-map'),
  loading: Loading,
  delay: 150,
})

const SubordinateCompany = Loadable({
  loader: () => import('@/pages/system-config/subordinate-company'),
  loading: Loading,
  delay: 150,
})

export default [
  {
    title: '异常反馈',
    path: '/system-config/feedback',
    component: <UserFeedBack />,
  },
  {
    title: '地图源配置',
    path: '/system-config/custom-map',
    component: <CustomMap />,
  },
  {
    title: '下级公司配置',
    path: '/system-config/subordinate-company',
    component: <SubordinateCompany />,
  },
]
