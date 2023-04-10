import Loadable from 'react-loadable'
import React from 'react'
import Loading from '@ant-design/pro-layout/es/PageLoading'

const NoJurisdictionPage = Loadable({
  loader: () => import('@/pages/401/index'),
  loading: Loading,
  delay: 150,
})

export default [
  {
    title: '401',
    path: '/401',
    component: <NoJurisdictionPage />,
  },
]
