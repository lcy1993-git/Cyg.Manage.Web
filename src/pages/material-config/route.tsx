import Loadable from 'react-loadable'
import React from 'react'
import Loading from '@ant-design/pro-layout/es/PageLoading'

const WareHouse = Loadable({
  loader: () => import('@/pages/material-config/ware-house'),
  loading: Loading,
  delay: 150,
})

const Inventroy = Loadable({
  loader: () => import('@/pages/material-config/inventory'),
  loading: Loading,
  delay: 150,
})

export default [
  {
    title: '协议库存管理',
    path: '/material-config/inventory',
    component: <Inventroy />,
  },
  {
    title: '物料利库管理',
    path: '/material-config/ware-house',
    component: <WareHouse />,
  },
]
