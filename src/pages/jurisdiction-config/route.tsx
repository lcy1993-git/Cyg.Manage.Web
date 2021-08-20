import Loadable from 'react-loadable';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const ManageUser = Loadable({
  loader: () => import('@/pages/jurisdiction-config/manage-user'),
  loading: Loading,
  delay: 150,
});

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
const CompanyUser = Loadable({
  loader: () => import('@/pages/jurisdiction-config/company-user'),
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

const WorkHandover = Loadable({
  loader: () => import('@/pages/jurisdiction-config/work-handover'),
  loading: Loading,
  delay: 150,
});

const CompanyGroup = Loadable({
  loader: () => import('@/pages/jurisdiction-config/company-group'),
  loading: Loading,
  delay: 150,
});

export default [
  {
    title: '管理员',
    path: '/jurisdiction-config/manage-user',
    component: <ManageUser />,
  },
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
    title: '账号管理',
    path: '/jurisdiction-config/company-user',
    component: <CompanyUser />,
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
    title: '协作单位',
    path: '/jurisdiction-config/subordinate-company',
    component: <SubordinateCompany />,
  },

  {
    title: '部组管理',
    path: '/jurisdiction-config/company-group',
    component: <CompanyGroup />,
  },

  {
    title: '工作交接',
    path: '/jurisdiction-config/work-handover',
    component: <WorkHandover />,
  },
];
