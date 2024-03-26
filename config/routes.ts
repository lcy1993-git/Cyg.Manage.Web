import { IConfigFromPlugins } from '@/.umi/core/pluginConfig'

const routes: IConfigFromPlugins['routes'] = [
  { path: '/', redirect: '/login' },
  { path: '/home/login', redirect: '/login' },
  { path: '/Home/Login', redirect: '/login' },
  { path: '/login', component: './login' },
  { path: '/instructionsManage', component: './instructions' },

  { path: '/instructionsInvestigate', component: './instructions' },
  { path: '/instructionsDesign', component: './instructions' },
  { path: '/instructionsReview', component: './instructions' },
  { path: '/instructionsCost', component: './instructions' },
  {
    path: '/',
    component: '../layouts/index.tsx',
    routes: [
      {
        path: '/index',
        component: './index',
      },
    ],
  },
]

export default routes
