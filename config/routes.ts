export default [
  {
    path: '/',
    redirect: "/login",
  },
  {
    path: '/home/login',
    redirect: "/login",
  },
  {
    path: '/Home/Login',
    redirect: "/login",
  },
  {
    path: '/login',
    component: "./login"
  },
  {
    path: '/instructionsManage', // 管理端说明书
    component: "./instructions"
  },
  {
    path: '/instructionsInvestigate', // 勘察端说明书
    component: "./instructions"
  },
  {
    path: '/instructionsDesign', // 设计端说明书
    component: "./instructions"
  },
  {
    path: '/instructionsReview', // 评审端说明书
    component: "./instructions"
  },
  {
    path: '/instructionsCost', // 造价模块说明书
    component: "./instructions"
  },
  {
    path: '/',
    component: "../layouts/index.tsx",
    routes: [
      {
        path: '/index',
        component: "./index"
      }
    ]
  },

];
