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
      // 171.223.214.154
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
    '/webGis/api': {
      target: 'http://10.6.1.36:8025/',
      changeOrigin: true,
      pathRewrite: { '^/webGis': '/' },
    },
    '/webGis2/api': {
      target: 'http://10.6.1.36:8014/',
      changeOrigin: true,
      pathRewrite: { '^/webGis2': '/' },
    },
    '/Comment/api': {
      target: 'http://10.6.1.36:8013/',
      changeOrigin: true,
      pathRewrite: { '^/Comment': '/' },
    },
    '/baidu/api': {
      target: 'https://map.baidu.com/',
      changeOrigin: true,
      pathRewrite: { '^/baidu/api': '/' },
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
