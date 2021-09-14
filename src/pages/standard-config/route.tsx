import Loadable from 'react-loadable';
import Loading from '@ant-design/pro-layout/es/PageLoading';

const ResourceLib = Loadable({
  loader: () => import('@/pages/standard-config/resource-lib'),
  loading: Loading,
  delay: 150,
});

const InfoManage = Loadable({
  loader: () => import('@/pages/standard-config/info-manage'),
  loading: Loading,
  delay: 150,
});

const SourceCompare = Loadable({
  loader: () => import('@/pages/standard-config/source-compare'),
  loading: Loading,
  delay: 150,
});

const ResourceManage = Loadable({
  loader: () => import('@/pages/standard-config/resource-manage'),
  loading: Loading,
  delay: 150,
});

const CompanyFile = Loadable({
  loader: () => import('@/pages/standard-config/company-file'),
  loading: Loading,
  delay: 150,
});

const SignManage = Loadable({
  loader: () => import('@/pages/standard-config/sign-manage'),
  loading: Loading,
  delay: 150,
});

export default [
  {
    title: '资源库',
    path: '/standard-config/resource-lib',
    component: <ResourceLib />,
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
];
