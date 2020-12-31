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
    ]
  }
];
