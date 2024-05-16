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

/**设计端登入需要该数据 */
export const configInfo: any = {
  requestUrl: {
    monitor: '/monitor/v2/api',
    project: '/manage/v2/api',
    common: '/common/api',
    upload: '/storage/api',
    resource: '/resourcemanage/v2/api',
    comment: '/project/api',
    tecEco: '/quota/api',
    tecEco1: '/technicaleconomy/api',
    review: '/review/v2/api',
    component: '/component/api',
    material: '/material/api/',
    resourceV1: '/resource/api',
    manage: '/webgis/api',
    geoserver: '/geoserver',
    securityAudit: '/securityaudit/api',
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
  commonServer: 'https://bbgl.gczhyun.com/common',
  version: '1.0.304',
}

const initConfig = async () => {
  const productCode = '1301726010322214912' //产品编号

  const SM2PrivateKey = '009761bb18f9621e5281b3a0d06edc8083c2625e0b15fdad25b14e8020c2cc9967' //解密私钥
  const handleDecrypto = (data: any) => {
    const cipherMode = 0
    const handleData = data.slice(2)
    return JSON.parse(sm2.doDecrypt(handleData, SM2PrivateKey, cipherMode))
  }

  const isBrowser = window.chrome?.webview ? false : true //根据该值判断当前管理端环境

  // const configInfo = await request('../dist/config/config.json', { method: 'GET' })

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

  // 浏览器环境下，获取当前服务器请求host及是否输出验证码；客户端环境则与c端通信获取相关数据
  if (isBrowser) {
    const host = window.location.host //主机地址
    const serverUrl = `${webConfig.commonServer}/api/ProductServer/GetList`

    const serverList = await request(serverUrl, {
      method: 'POST',

      data: { productCode, category: 0, status: 0, province: '' },
    })
    const { data } = serverList

    const currentServer = data.find((item: any) => item?.propertys?.webSite?.includes(host))

    localStorage.setItem('requestHost', currentServer?.propertys?.gatewayHost)

    const codeApi = `${webConfig.requestUrl.common}/System/GetDictionary`
    const SignCodeConfig = await request(codeApi, {
      method: 'POST',
      params: { key: 'EnableSignInCode' },
    })

    const handleValue = handleDecrypto(SignCodeConfig)?.content?.value

    Number(handleValue) && localStorage.setItem('EnableSignInCode', handleValue)
  } else {
    /**
     * WEB端嵌入客户端-初始化时通信获取相关数据
     * postMsg像c端发送关键字方法，调用对应c端方法
     * addEventListener监听获取登录数据，存入本地
     */
    ;(function postMsg() {
      const args = 'Func_PostStartupParameters'
      window.chrome?.webview.postMessage(args)
    })()

    window.chrome?.webview.addEventListener('message', receiveMessage)

    function receiveMessage(e: any) {
      localStorage.setItem('LoginDataFromWPF', JSON.stringify(e.data))
    }
  }
}

initConfig()
