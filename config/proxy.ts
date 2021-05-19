/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api/': {
      // http://10.6.1.36:8026/api/
      // 171.223.214.154
      target: 'http://10.6.1.36:21525',
      changeOrigin: true,
      pathRewrite: { '^/api': '/' },
    },
    '/design/api': {
      target: 'http://10.6.1.36:8014/',
      changeOrigin: true,
      pathRewrite: { '^/design': '/' },
    },
    '/Component': {
      target: 'http://10.6.1.36:8020/',
      changeOrigin: true,
      pathRewrite: { '^/Component': '/' },
    },
    '/Material': {
      target: 'http://10.6.1.36:8020/',
      changeOrigin: true,
      pathRewrite: { '^/Material': '/' },
    },
    '/ModulesDetails': {
      target: 'http://10.6.1.36:8020/',
      changeOrigin: true,
      pathRewrite: { '^/ModulesDetails': '/' },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  // version: {
  //   '/api/': {
  //     target: 'http://service.sirenmap.com:8101/',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  // },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
