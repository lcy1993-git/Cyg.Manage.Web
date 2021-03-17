import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const path = require('path');

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
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
  title: "管理端",
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // https://github.com/zthxxx/react-dev-inspector
  plugins: ['react-dev-inspector/plugins/umi/react-inspector'],
  inspectorConfig: {
    // loader options type and docs see below
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
  resolve: {
    includes: ['src/components'],
  },
  lessLoader: {
    modifyVars: {
      // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
      'hack': `true; @import "~@/styles/base.less";`
    }
  },
  
});
