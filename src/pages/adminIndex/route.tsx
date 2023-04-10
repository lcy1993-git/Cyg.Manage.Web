import Loadable from 'react-loadable'
// @ts-ignore
import React from 'react'
import Loading from '@ant-design/pro-layout/es/PageLoading'

const AdminIndexHome = Loadable({
  loader: () => import('@/pages/adminIndex/home/index'),
  loading: Loading,
  delay: 150,
})
const AdminIndexReport = Loadable({
  loader: () => import('@/pages/adminIndex/report/index'),
  loading: Loading,
  delay: 150,
})
export default [
  {
    title: '首页',
    path: '/admin-index/home',
    component: <AdminIndexHome />,
  },
  {
    title: '登录报表',
    path: '/admin-index/report/1',
    component: <AdminIndexReport />,
  },
  {
    title: '退出登录报表',
    path: '/admin-index/report/2',
    component: <AdminIndexReport />,
  },
  {
    title: '账号状态修改报表',
    path: '/admin-index/report/3',
    component: <AdminIndexReport />,
  },
  {
    title: '账号密码修改报表',
    path: '/admin-index/report/4',
    component: <AdminIndexReport />,
  },
  {
    title: '文件传输报表',
    path: '/admin-index/report/5',
    component: <AdminIndexReport />,
  },
  {
    title: '连接超时报表',
    path: '/admin-index/report/6',
    component: <AdminIndexReport />,
  },
  {
    title: '项目数据修改报表',
    path: '/admin-index/report/7',
    component: <AdminIndexReport />,
  },
  {
    title: '项目流程变化报表',
    path: '/admin-index/report/8',
    component: <AdminIndexReport />,
  },
  {
    title: '项目变动报表',
    path: '/admin-index/report/9',
    component: <AdminIndexReport />,
  },
  {
    title: '资源库变动报表',
    path: '/admin-index/report/10',
    component: <AdminIndexReport />,
  },
  {
    title: '所有事件报表',
    path: '/admin-index/report/11',
    component: <AdminIndexReport />,
  },
  {
    title: '系统事件报表',
    path: '/admin-index/report/12',
    component: <AdminIndexReport />,
  },
  {
    title: '业务事件报表',
    path: '/admin-index/report/13',
    component: <AdminIndexReport />,
  },
]
