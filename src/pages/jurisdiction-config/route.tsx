import Loadable from 'react-loadable';
import React from 'react';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const CompanyManage = Loadable({
  loader: () => import('@/pages/jurisdiction-config/company-manage'),
  loading: Loading,
  delay: 150,
});
const PlatformRole = Loadable({
  loader: () => import('@/pages/jurisdiction-config/platform-role'),
  loading: Loading,
  delay: 150,
});
const PlatformAuthorization = Loadable({
  loader: () => import('@/pages/jurisdiction-config/platform-authorization'),
  loading: Loading,
  delay: 150,
});
const RolePermissions = Loadable({
  loader: () => import('@/pages/jurisdiction-config/role-permissions'),
  loading: Loading,
  delay: 150,
});
const ProjectPermission = Loadable({
  loader: () => import('@/pages/jurisdiction-config/project-permission'),
  loading: Loading,
  delay: 150,
});

const SubordinateCompany = Loadable({
  loader: () => import('@/pages/jurisdiction-config/subordinate-company'),
  loading: Loading,
  delay: 150,
});
export default [
  {
    title: '公司管理',
    path: '/jurisdiction-config/company-manage',
    component: <CompanyManage />,
  },
  {
    title: '平台角色',
    path: '/jurisdiction-config/platform-role',
    component: <PlatformRole />,
  },
  {
    title: '平台授权',
    path: '/jurisdiction-config/platform-authorization',
    component: <PlatformAuthorization />,
  },
  {
    title: '功能权限',
    path: '/jurisdiction-config/role-permissions',
    component: <RolePermissions />,
  },
  {
    title: '项目权限',
    path: '/jurisdiction-config/project-permission',
    component: <ProjectPermission />,
  },
  {
    title: '下辖公司',
    path: '/jurisdiction-config/subordinate-company',
    component: <SubordinateCompany />,
  },
];
