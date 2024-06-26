import Loading from '@ant-design/pro-layout/es/PageLoading'
import Loadable from 'react-loadable'
const CanonyResourceLib = Loadable({
  loader: () => import('@/pages/standard-config/canon-resource-lib'),
  loading: Loading,
  delay: 150,
})

const CompanyResourceLib = Loadable({
  loader: () => import('@/pages/standard-config/company-resource-lib'),
  loading: Loading,
  delay: 150,
})

const LineStressSagManage = Loadable({
  loader: () => import('@/pages/standard-config/line-stress-sag-manage'),
  loading: Loading,
  delay: 150,
})

const InfoManage = Loadable({
  loader: () => import('@/pages/standard-config/info-manage'),
  loading: Loading,
  delay: 150,
})

const SourceCompare = Loadable({
  loader: () => import('@/pages/standard-config/source-compare'),
  loading: Loading,
  delay: 150,
})

const ResourceManage = Loadable({
  loader: () => import('@/pages/standard-config/resource-manage'),
  loading: Loading,
  delay: 150,
})

const CompanyFile = Loadable({
  loader: () => import('@/pages/standard-config/company-file'),
  loading: Loading,
  delay: 150,
})

const SignManage = Loadable({
  loader: () => import('@/pages/standard-config/sign-manage'),
  loading: Loading,
  delay: 150,
})
const ApprovalList = Loadable({
  loader: () => import('@/pages/standard-config/approval-list'),
  loading: Loading,
  delay: 150,
})
const ApprovalManage = Loadable({
  loader: () => import('@/pages/standard-config/approval-manage'),
  loading: Loading,
  delay: 150,
})

const StationHouse = Loadable({
  loader: () => import('@/pages/standard-config/station-house'),
  loading: Loading,
  delay: 150,
})

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    title: '典设资源库',
    path: '/standard-config/canon-resource-lib',
    component: <CanonyResourceLib />,
  },
  {
    title: '公司资源库',
    path: '/standard-config/company-resource-lib',
    component: <CompanyResourceLib />,
  },
  {
    title: '应力弧垂表',
    path: '/standard-config/line-stress-sag',
    component: <LineStressSagManage />,
  },
  {
    title: '版本对比',
    path: '/standard-config/source-compare',
    component: <SourceCompare />,
  },
  {
    title: '成果模板',
    path: '/standard-config/company-file',
    component: <CompanyFile />,
  },
  {
    title: '资源库模块管理',
    path: '/standard-config/resource-manage',
    component: <ResourceManage />,
  },
  {
    title: '签批文件',
    path: '/standard-config/sign-manage',
    component: <SignManage />,
  },
  {
    title: '宣贯',
    path: '/standard-config/info-manage',
    component: <InfoManage />,
  },
  {
    title: '资源审批',
    path: '/standard-config/approval-list',
    component: <ApprovalList />,
  },
  {
    title: '资源审批管理',
    path: '/standard-config/approval-manage',
    component: <ApprovalManage />,
  },
  {
    title: '站房方案管理',
    path: '/standard-config/station-house',
    component: <StationHouse />,
  },
]
