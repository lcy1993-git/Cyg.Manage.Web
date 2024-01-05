import DesignMaterialMapping from '@/pages/technology-economic/design-material-mapping'
import MappingInfomation from '@/pages/technology-economic/mapping-infomation'
import MaterialMapping from '@/pages/technology-economic/material-mapping'
import SocialSecurityFund from '@/pages/technology-economic/social-security-fund'
import Loading from '@ant-design/pro-layout/es/PageLoading'
// @ts-ignore
import React from 'react'
import Loadable from 'react-loadable'
import CostTemplate from './cost-template'
import DesignMappingInfo from './design-mapping-info'
import SuppliesLibrary from './supplies-library'
import SupplieslInfomation from './suppliesl-infomation'
import TotalTable from './total-table'
import UsualQuotaTable from './usual-quota-table'
import UsualQuotaTableDetail from './usual-quota-table/components/detail'

const QuotaLibrary = Loadable({
  loader: () => import('@/pages/technology-economic/quota-library'),
  loading: Loading,
  delay: 150,
})
const QuotaInfomation = Loadable({
  loader: () => import('@/pages/technology-economic/quota-infomation'),
  loading: Loading,
  delay: 150,
})
const ReinforcementQuota = Loadable({
  loader: () =>
    import('@/pages/technology-economic/quota-infomation/components/reinforcement-quota'),
  loading: Loading,
  delay: 150,
})
const MaterialLibrary = Loadable({
  loader: () => import('@/pages/technology-economic/material-library'),
  loading: Loading,
  delay: 150,
})
const MaterialInfomation = Loadable({
  loader: () => import('@/pages/technology-economic/material-infomation'),
  loading: Loading,
  delay: 150,
})
const PricingTemplates = Loadable({
  loader: () => import('@/pages/technology-economic/pricing-templates'),
  loading: Loading,
  delay: 150,
})
const CommonRate = Loadable({
  loader: () => import('@/pages/technology-economic/common-rate'),
  loading: Loading,
  delay: 150,
})
const ProjectList = Loadable({
  loader: () => import('@/pages/technology-economic/project-list'),
  loading: Loading,
  delay: 150,
})
const CommonRateInfomation = Loadable({
  loader: () => import('@/pages/technology-economic/common-rate-infomation'),
  loading: Loading,
  delay: 150,
})
const SpreadCoefficient = Loadable({
  loader: () => import('@/pages/technology-economic/spread-coefficient'),
  loading: Loading,
  delay: 150,
})
const PriceDifferenceDetails = Loadable({
  loader: () => import('@/pages/technology-economic/price-difference-details'),
  loading: Loading,
  delay: 150,
})
const AdjustmentFileDetails = Loadable({
  loader: () => import('@/pages/technology-economic/adjustment-file-details'),
  loading: Loading,
  delay: 150,
})
const AreaTypeManage = Loadable({
  loader: () => import('@/pages/technology-economic/area-type-manage'),
  loading: Loading,
  delay: 150,
})
const Expression = Loadable({
  loader: () => import('@/pages/technology-economic/expression'),
  loading: Loading,
  delay: 150,
})

const AssemblyLibrary = Loadable({
  loader: () => import('@/pages/technology-economic/assembly-library'),
  loading: Loading,
  delay: 150,
})

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    title: '定额库',
    path: '/technology-economic/quota-library',
    component: <QuotaLibrary />,
  },
  {
    title: '查看定额库',
    path: '/technology-economic/quota-infomation',
    component: <QuotaInfomation />,
  },
  {
    title: '查看钢筋定额',
    path: '/technology-economic/quota-infomation/components/reinforcement-quota',
    component: <ReinforcementQuota />,
  },
  {
    title: '材机库',
    path: '/technology-economic/material-library',
    component: <MaterialLibrary />,
  },
  {
    title: '查看材机库',
    path: '/technology-economic/material-infomation',
    component: <MaterialInfomation />,
  },
  {
    title: '计价模板',
    path: '/technology-economic/pricing-templates',
    component: <PricingTemplates />,
  },
  {
    title: '常用费率',
    path: '/technology-economic/common-rate',
    component: <CommonRate />,
  },
  {
    title: '费率详情',
    path: '/technology-economic/common-rate-infomation',
    component: <CommonRateInfomation />,
  },
  {
    title: '工程量目录',
    path: '/technology-economic/project-list',
    component: <ProjectList />,
  },
  {
    title: '价差系数',
    path: '/technology-economic/spread-coefficient',
    component: <SpreadCoefficient />,
  },
  {
    title: '价差详情',
    path: '/technology-economic/price-difference-details',
    component: <PriceDifferenceDetails />,
  },
  {
    title: '调整文件详情',
    path: '/technology-economic/adjustment-file-details',
    component: <AdjustmentFileDetails />,
  },
  {
    title: '取费表',
    path: '/technology-economic/cost-template',
    component: <CostTemplate />,
  },
  {
    title: '总算表',
    path: '/technology-economic/total-table',
    component: <TotalTable />,
  },
  {
    title: '定额常用表',
    path: '/technology-economic/usual-quota-table',
    component: <UsualQuotaTable />,
  },
  {
    title: '费率详情',
    path: '/technology-economic/usual-quota-table/detail',
    component: <UsualQuotaTableDetail />,
  },
  {
    title: '物料库',
    path: '/technology-economic/supplies-library',
    component: <SuppliesLibrary />,
  },
  {
    title: '地区分类管理',
    path: '/technology-economic/area-type-manage',
    component: <AreaTypeManage />,
  },
  {
    title: '社保公积金费率',
    path: '/technology-economic/social-security-fund',
    component: <SocialSecurityFund />,
  },
  {
    title: '查看物料库',
    path: '/technology-economic/suppliesl-infomation',
    component: <SupplieslInfomation />,
  },
  {
    title: '物料库映射',
    path: '/technology-economic/material-mapping',
    component: <MaterialMapping />,
  },
  {
    title: '物料库映射详情',
    path: '/technology-economic/mapping-infomation',
    component: <MappingInfomation />,
  },
  {
    title: '设计端物料库映射',
    path: '/technology-economic/design-material-mapping',
    component: <DesignMaterialMapping />,
  },
  {
    title: '查看设计端物料库映射',
    path: '/technology-economic/design-mapping-info',
    component: <DesignMappingInfo />,
  },
  {
    title: '表达式',
    path: '/technology-economic/expression',
    component: <Expression />,
  },
  {
    title: '组合件库',
    path: '/technology-economic/assembly-library',
    component: <AssemblyLibrary />,
  },
]
