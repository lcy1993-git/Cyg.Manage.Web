export default [
  {
    path: '/',
    redirect: "/login",
  },
  {
    path: '/login',
    component: "./login"
  },
  {
    path: '/',
    component: "../layouts/index.tsx",
    routes: [
      {
        path: '/index',
        component: "./index"
      },
      //TODO 后续根据模块进行拆分
      {
        path: '/system-config/function-module',
        component: "./system-config/function-module"
      }
    ]
  }
];
