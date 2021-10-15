import request from 'umi-request';
// 为了防止有可能初始化失败，所以先默认一套设置
export let webConfig = {
  requestUrl: {
    project: '/manage/v2/api',
    common: '/common/api',
    upload: '/storage/api',
    resource: '/resourcemanage/v2/api',
    webGis: '/webgis/api',
    webGis2: '/webgis2/api',
    comment: '/project/api',
    tecEco: '/quota/api',
    tecEco1: '/technicaleconomy/api',
    review: '/review/api',
    component: '/component/api',
    material: '/material/api/',
    resourceV1: '/resource/api',
    manage: '/manage/api',
    geoserver: '/geoserver',
    design: '/design/api',
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
};

const initConfig = async () => {
  const configInfo = await request('/config/config.json', { method: 'GET' });
  webConfig = configInfo;
};

initConfig();
