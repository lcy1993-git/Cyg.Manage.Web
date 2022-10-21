import { cloneDeep } from 'lodash'
import request from 'umi-request'
const { NODE_ENV } = process.env
// 为了防止有可能初始化失败，所以先默认一套设置
export let webConfig = {
  requestUrl: {
    monitor: '/monitor/v2/api',
    project: '/manage/v2/api',
    common: '/common/api',
    upload: '/storage/api',
    resource: '/resourcemanage/v2/api',
    webGis: '/webgis/api',
    webGis2: '/webgis2/api',
    comment: '/project/api',
    tecEco: '/quota/api',
    tecEco1: '/technicaleconomy/api',
    review: '/review/v2/api',
    component: '/component/api',
    material: '/material/api/',
    resourceV1: '/resource/api',
    manage: '/manage/api',
    geoserver: '/geoserver',
    design: '/design/api',
    grid: '/gridremediation/api',
    geoServerUrl: '/geoserver/pdd/ows/',
    netFrameworkHistory: '/gridpredesign/api',
  },
  logoUrl: {
    '218.6.242.125': 'ke-rui-logo.png',
    '10.6.1.36': 'ke-rui-logo.png',
    '10.6.1.37': 'logo.png',
    '171.223.214.154': 'logo.png',
    '47.108.63.23': 'logo.png',
    '39.99.251.67': 'logo.png',
    '10.6.1.38': 'logo.png',
  },
  areaStatisticsUrl: '/chart/index.html',
  version: '1.0.130',
  commonServer: 'https://service.pwcloud.cdsrth.com:8101',
}

const initConfig = async () => {
  const configInfo = await request('/config/config.json', { method: 'GET' })
  if (NODE_ENV === 'development') {
    // 如果是开发环境，那么将webConfig.requestUrl 中的每一个数据前面加上 /api
    const copyConfig = cloneDeep(configInfo)

    const { requestUrl } = copyConfig
    let newRequestUrl = {}
    if (requestUrl) {
      Object.keys(requestUrl).forEach((key) => {
        newRequestUrl[key] = `/api${requestUrl[key]}`
      })
    }
    webConfig = {
      ...configInfo,
      requestUrl: newRequestUrl,
    }
  } else {
    webConfig = configInfo
  }
}

initConfig()
