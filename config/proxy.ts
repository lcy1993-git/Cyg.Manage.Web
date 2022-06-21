/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  dev: {
    '/api/': {
      // http://10.6.1.54:21525/api/
      // 171.223.214.154:21573
      target: 'https://srthkf2.gczhyun.com:21530',
      // target: 'https://xj.gczhyun.com/',
      // target: 'https://xjfz.gczhyun.com',
      // target: 'https://srthcs1.gczhyun.com:21564',
      // target: 'https://cy.gczhyun.com:21553',
      // target: 'https://srthk8scs2.gczhyun.com:21530',
      // 测试服 1
      // target: 'http://171.223.214.154:21563',
      // 测试服 2
      // target: 'http://171.223.214.154:21573',
      changeOrigin: true,
      pathRewrite: { '^/api': '/' },
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
}
