import { cloneDeep } from 'lodash'
//@ts-ignore
import sm2 from 'sm-crypto/dist/sm2'
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
    // webGis: '/webgis/api',
    // webGis2: '/webgis2/api',
    comment: '/project/api',
    tecEco: '/quota/api',
    tecEco1: '/technicaleconomy/api',
    review: '/review/v2/api',
    component: '/component/api',
    material: '/material/api/',
    resourceV1: '/resource/api',
    manage: '/webgis/api',
    geoserver: '/geoserver',
    design: '/design/api',
    grid: '/gridremediation/api',
    securityAudit: '/securityaudit/api',
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

export let serverCode = {
  'https://srthkf1.gczhyun.com:21530/': '1428961053395521536',
}

const initConfig = async () => {
  // 产品编号
  const productCode = '1301726010322214912'

  // 加密公钥
  // const SM2PublicKey =
  //   '047981ed79b74289fd6e28fabe9002c07837892b20a919faecfedcaa1edfaf120031181d0fee61045323c010de4896a389c875baa882073125a4e97ab760bdfa74'

  // 加密方法
  // const handleSM2Crypto = (data: any) => {
  //   const cipherMode = 0
  //   // 加密结果
  //   return '04' + sm2.doEncrypt(data, SM2PublicKey, cipherMode)
  // }

  const SM2PrivateKey = '009761bb18f9621e5281b3a0d06edc8083c2625e0b15fdad25b14e8020c2cc9967'
  const handleDecrypto = (data: any) => {
    const cipherMode = 0
    const handleData = data.slice(2)
    return JSON.parse(sm2.doDecrypt(handleData, SM2PrivateKey, cipherMode))
  }

  const configInfo = await request('/config/config.json', { method: 'GET' })

  //新增是否使用隔离装置中转开关判断
  // const host = window.location.host

  // if (host.includes('117.191.93.63')) {
  //   //全过程判断
  //   localStorage.setItem('isTransfer', '1')
  // } else {
  //   //非全过程
  //   localStorage.setItem('isTransfer', '0')
  // }

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

  // 获取当前服务器请求host
  const host = window.location.host
  const serverUrl = `${webConfig.commonServer}/api/ProductServer/GetList`

  const serverList = await request(serverUrl, {
    method: 'POST',

    data: { productCode, category: 0, status: 0, province: '' },
  })
  const { data } = serverList

  const currentServer = data.find((item: any) => item?.propertys?.webSite?.includes(host))
  localStorage.setItem('requestHost', currentServer?.propertys?.host)

  // const isTrans = localStorage.getItem('isTransfer')

  //此处同request用于判断是否显示code的请求接口使用什么地址
  // const targetUrl = handleSM2Crypto(
  //   `http://172.2.48.22${webConfig.requestUrl.common}/System/GetDictionary`
  // )
  const codeApi = `${webConfig.requestUrl.common}/System/GetDictionary`
  // : `http://117.191.93.63:21525/commonPost?param=${targetUrl}`
  const SignCodeConfig = await request(codeApi, {
    method: 'POST',
    params: { key: 'EnableSignInCode' },
  })

  SignCodeConfig &&
    localStorage.setItem('EnableSignInCode', handleDecrypto(SignCodeConfig)?.content?.value)
}

initConfig()
