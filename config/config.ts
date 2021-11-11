import { defineConfig } from 'umi'
import defaultSettings from './defaultSettings'
import proxy from './proxy'
import routes from './routes'

const { REACT_APP_ENV } = process.env

export default defineConfig({
  hash: true,
  publicPath: '/',
  antd: {},
  dva: {
    hmr: true,
  },
  layout: false,
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
    },
  },
  title: '管理端',
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  resolve: {
    includes: ['src/components'],
  },
  lessLoader: {
    modifyVars: {
      // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
      hack: `true; @import "~@/styles/base.less";`,
    },
  },
  extraPostCSSPlugins: [require('tailwindcss')],
  // webpack5: {},

  chainWebpack(config: any) {
    config.module
      .rule('docx-with-file')
      .test(/.docx$/)
      .use('url-loader')
      .loader('file-loader')
    config.module.rule('xls-with-file').test(/.xls$/).use('url-loader').loader('file-loader')
    config.module
      .rule('xlsx-with-file')
      .test(/.xlsx$/)
      .use('url-loader')
      .loader('file-loader')

    // webpack5
    // config.module.rule('mjs-rule').test(/.m?js/).resolve.set('fullySpecified', false)
  },
})
