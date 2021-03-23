/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/project/api': {
      // http://10.6.1.36:8026/api/
      target: 'http://10.6.1.36:8026',
      changeOrigin: true,
      pathRewrite: { '^/project': '/' },
    },
    '/common/api': {
      target: 'http://10.6.1.36:8022/',
      changeOrigin: true,
      pathRewrite: { '^/common': '/' },
    },
    '/upload/api': {
      target: 'http://10.6.1.36:8023/',
      changeOrigin: true,
      pathRewrite: { '^/upload': '/' },
    },
    '/resource/api': {
      target: 'http://10.6.1.36:8020/',
      changeOrigin: true,
      pathRewrite: { '^/resource': '/' },
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
