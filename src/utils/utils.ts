import { webConfig } from '@/global'
import Login from '@/pages/login'
import { getProductServerList, getStopServerNotice } from '@/services/index'
import {
  EventInfo,
  UploadAuditEventInfo,
  UploadAuditEventInfoWithoutToken,
} from '@/services/security-audit'
import { MaterialDataType } from '@/services/visualization-results/list-menu'
import moment from 'moment/moment'
// @ts-ignore
import sm2 from 'sm-crypto/dist/sm2'

const { NODE_ENV } = process.env
/**
 *  @param treeData 需要平铺的树状数据
 *  @param childName 儿子数组的名称
 *  @param parentId
 *  @param parentIdName
 *  @returns 平铺的数据
 * */

export const flatten = <P extends {}>(
  treeData: any,
  childName: string = 'children',
  parentId: string = '',
  parentIdName: string = 'id'
): P[] => {
  if (treeData && treeData.length) {
    return treeData.reduce((arr: object[], item: object) => {
      return arr.concat(
        [{ ...item, parentId }],
        flatten(item[childName], childName, item[parentIdName], parentIdName)
      )
    }, [])
  }
  return []
}

interface ToTreeDataOptions {
  keyField?: string
  childField?: string
  parentField?: string
}

// request公共组件get传参处理
export const handleGetUrl = (
  params: any,
  requestUrl: any,
  isEncrypt?: boolean | undefined
): string => {
  let _str = ''
  let _handleUrl = requestUrl
  params['X_Reqid'] = getUUid()
  params['X_TimeStamp'] = Date.parse(`${new Date()}`)
  Object.keys(params!).forEach((key) => {
    _str += `&${key}=${params[key]}`
  })

  const _url = _str.replace('&', '?')

  //  开发环境和生产环境截取接口字符串
  if (NODE_ENV === 'development') {
    _handleUrl = _handleUrl.includes('bbgl') ? _handleUrl.slice(23) : _handleUrl.slice(4)
  }
  const finalUrl = _handleUrl + _url
  // console.log(finalUrl, 'final')
  if (isEncrypt) {
    return `?param=${encodeURIComponent(finalUrl)}`
  } else {
    return `?param=${handleSM2Crypto(finalUrl)}`
  }
}

// request公共组件post传参处理
export const handlePostData = (data: any, isEncrypt?: boolean | undefined): string => {
  const handleParams = isEncrypt
    ? { ...data, X_Reqid: getUUid(), X_TimeStamp: Date.parse(`${new Date()}`) }
    : {
        X_Data: data,
        X_Reqid: getUUid(),
        X_TimeStamp: Date.parse(`${new Date()}`),
      }
  if (isEncrypt) {
    return handleParams
  } else {
    return handleSM2Crypto(JSON.stringify(handleParams))
  }
}

export const toTreeData = <P, T>(data: P[], options: ToTreeDataOptions = {}): T[] => {
  const list = JSON.parse(JSON.stringify(data))

  const { keyField = 'id', childField = 'children', parentField = 'parentId' } = options

  const tree = []
  const record = {}

  for (let i = 0, len = list.length; i < len; i += 1) {
    const item = list[i]
    const id = item[keyField]

    if (!id) {
      continue
    }

    if (record[id]) {
      item[childField] = record[id]
    } else {
      item[childField] = record[id] = []
    }

    if (item[parentField]) {
      const parentId = item[parentField]

      if (!record[parentId]) {
        record[parentId] = []
      }

      record[parentId].push(item)
    } else {
      tree.push(item)
    }
  }

  return tree
}

/**
 *  @param needHandleData 需要处理的数组
 *  @returns 处理好的数据
 * */

export const handleJurisdictionData = (needHandleData: any[]) => {
  return needHandleData?.map(mapJurisdictionData)
}

const mapJurisdictionData = (data: any) => {
  const { id, name, hasPermission = true } = data
  const children = data.children ?? []
  return {
    id,
    name,
    hasPermission,
    functions: children
      .filter((item: any) => item.category === 3)
      .map((item: any) => ({
        name: item.name,
        id: item.id,
        hasPermission: item.hasPermission ?? true,
      })),
    children: children.filter((item: any) => item.category !== 3).map(mapJurisdictionData),
  }
}

export interface TreeData {
  readonly id: string
  parentId: string | null
  children?: TreeData[]
  key: string
  [key: string]: unknown
}

/**
 * 树形结构化
 * @param data 平铺的扁平数组
 * @returns 树形结构数组
 */
export const formatDataTree = (data: TreeData[]) => {
  // if(!Array.isArray(data)) return [];
  const parents = data.filter((p) => p.parentId === null)
  const children = data.filter((p) => p.parentId !== null)
  dataToTree(parents, children)
  function dataToTree(parents: TreeData[], children: TreeData[]) {
    parents.forEach((p) => {
      children.forEach((c) => {
        if (p.id === c.parentId) {
          if (!p.children) p.children = []
          p.children.push(c)
          dataToTree([c], children)
        }
      })
    })
  }
  return parents
}

/**
 * 格式化数据
 * 将树形结构数据转为Tree.DirectoryTree组件可识别数据
 * @param data 树形结构数组
 * @returns 带有key,title,isLeaf的树形结构数组
 */
export const fileTreeFormData = (data: TreeData[]) => {
  const res = data
  data.forEach((i) => {
    i.title = i.name
    i.key = i.id
    if (i.children && i.children.length > 0) {
      fileTreeFormData(i.children)
    } else {
      i.isLeaf = true
    }
  })
  return res
}

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 可视化成果多媒体材料数据格式化
 * @param content
 * @returns
 */
export const formDataMateral = (content: any) => {
  const filterData = content.filter((item: any) => item.parentID !== -1)
  const data = filterData.map((item: any) => {
    return {
      ...item,
      // state: getProperties?.state,
      // children: [],
    }
  })
  return data.reduce((curr: any, item: any) => {
    const exist = curr.find((currItem: any) => currItem.type === item.type)
    if (exist) {
      curr.forEach((currExist: any, index: any) => {
        if (currExist.type === exist.type) {
          if (!Array.isArray(curr[index].children)) {
            curr[index].children = []
          }
          curr[index].children.push(item)
        }
      })
    } else {
      if (!Array.isArray(curr)) {
        curr = []
      }
      curr.push(item)
    }
    return curr
  }, [])
}

export const generateMaterialTreeList = (materialData: MaterialDataType[]): MaterialDataType[] => {
  /**
   * 获取type
   */
  const typeSet: Set<string | undefined> = new Set(
    materialData.map((v) => {
      return v.type
    })
  )
  /**
   * 先获取到所有的type
   */

  const typeArr = [...typeSet]
  //创建第一层结构
  const parentArr: MaterialDataType[] = typeArr.map((type) => ({
    key: `type${Math.random()}`,
    type: type,
    children: undefined,
  }))
  parentArr.forEach((value) => {
    value.children = materialData.filter((materialItem) => {
      materialItem.key = Math.random().toLocaleString()
      return materialItem.type === value.type
    })
  })

  return parentArr
}

/**
 * 创建唯一标识
 * @returns
 */
export const generateUUID = () => {
  let d = new Date().getTime()
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}

export const handleRate = (number: number) => {
  const ret = new RegExp(/^\d+(\.\d{1,2})?$/)
  if (ret.test(String(number))) return number
  return number.toFixed(2)
}

// export const BlobOrArrayBuffertoUnit8 = (data: Blob | ArrayBuffer) => {
//   switch (Object.prototype.toString.call(b)) {
//     case '[object Blob]':
//       break

//     case '[object ArrayBuffer]':
//       break

//     default:
//       break
//   }
// }

interface Data {
  parentID: number
  id: number
  children?: Data[]

  [key: string]: any
}

/**
 * 材料表扁平化数据树形结构化
 */
export const translateMatDataToTree = (soureceData: Data[]) => {
  const data = soureceData.map((dataItem) => {
    return {
      ...dataItem,
    }
  })
  let parents = data.filter((value) => value.parentID === -1)

  let childrens = data.filter((value) => value.parentID !== -1)

  const translator = (parents: Data[], childrens: Data[]) => {
    parents.forEach((parent) => {
      childrens.forEach((current, index) => {
        if (current.parentID === parent.id) {
          let temp = JSON.parse(JSON.stringify(childrens))
          temp.splice(index, 1)
          translator([current], temp)

          typeof parent.children !== 'undefined'
            ? parent.children.push(current)
            : (parent.children = [current])
        }
      })
    })
  }

  translator(parents, childrens)

  return parents
}
/*
 * 获取停服公告信息
 * */
type Login = {
  userName: string
  pwd: string
}

export const getObject = (value: string): any => {
  const obj = {}
  obj['key'] = value
  return obj
}

export const getUUid = (length = 32) => {
  const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let randomString = '' // 考虑到32位大约是UUID的长度

  for (let i = 0; i < length; i++) {
    // 使用crypto API得到一个随机索引
    const randomIndex = Math.floor(
      (crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) * possibleChars.length
    )
    randomString += possibleChars.charAt(randomIndex)
  }
  return randomString
}

export const productCode = '1301726010322214912'

const SM2PublicKey =
  '047981ed79b74289fd6e28fabe9002c07837892b20a919faecfedcaa1edfaf120031181d0fee61045323c010de4896a389c875baa882073125a4e97ab760bdfa74'
// sm2加密密码
export const handleSM2Crypto = (data: any) => {
  const cipherMode = 0
  // 加密结果
  return '04' + sm2.doEncrypt(data, SM2PublicKey, cipherMode)
}

const SM2PrivateKey = '009761bb18f9621e5281b3a0d06edc8083c2625e0b15fdad25b14e8020c2cc9967'
export const handleDecrypto = (data: any) => {
  if (data) {
    const cipherMode = 0
    const handleData = data.slice(2)
    return JSON.parse(sm2.doDecrypt(handleData, SM2PrivateKey, cipherMode))
  }
}

export const uploadAuditLog = (dataItem: Partial<EventInfo>[], needToken: boolean = false) => {
  const userInfo = JSON.parse(JSON.stringify(localStorage.getItem('userInfo') || ''))
  if (dataItem.length > 0) {
    dataItem[0].clientType = 1
    dataItem[0].clientVersion = webConfig?.version || ''
    dataItem[0].executionTime = moment().format('YYYY-MM-DD HH:mm:ss')
    dataItem[0].executionUserId = userInfo?.id || ''
    dataItem[0].executionUserName = userInfo?.userName || ''
  }
  if (needToken) {
    UploadAuditEventInfoWithoutToken({
      data: dataItem,
      X_Reqid: getUUid(),
      X_TimeStamp: new Date().valueOf(),
    }).then()
  } else {
    UploadAuditEventInfo(dataItem)
  }
}

// export const getStopServerList = () => {
//   getProductServerList({
//     productCode: '1301726010322214912',
//     category: 0,
//     status: 0,
//     province: '',
//   }).then((res) => {
//     if (res?.code !== 200) {
//       return
//     }
//     const { data } = res
//     const url = window.location.href.split('/')?.slice(0, 3)?.join('/')
//     const currenServer = data?.find(
//       (item: { propertys: { webSite: string; host: string | null } }) => {
//         if (NODE_ENV === 'development' && item?.propertys?.webSite) {
//           return item?.propertys?.webSite === 'https://srthkf3.gczhyun.com:21530/'
//         } else if (item?.propertys?.webSite) {
//           if (item?.propertys?.host) {
//             return url === item?.propertys?.host?.split('/')?.slice(0, 3)?.join('/')
//           } else {
//             return url === item?.propertys?.webSite?.split('/')?.slice(0, 3)?.join('/')
//           }
//         } else {
//           return undefined
//         }
//       }
//     )
//     if (currenServer && currenServer?.code) {
//       // 是否查询到 服务器信息
//       localStorage.setItem('serverCode', currenServer?.code || '')
//     }
//   })
// }

export const getStopServerList = (
  loginFuc: CallableFunction,
  values: Login,
  stopLoginFuc?: CallableFunction
) => {
  getProductServerList({
    productCode,
    category: 0,
    status: 0,
    province: '',
  })
    .then((res) => {
      if (res?.code !== 200) {
        loginFuc(values)
        return
      }
      const { data } = res
      const url = window.location.href.split('/')?.slice(0, 3)?.join('/')
      const currenServer = data?.find(
        (item: {
          propertys: {
            webSite: string
            host: string | null
            gatewayHost: string | null
            reviewGatewayHost: string | null
          }
        }) => {
          if (NODE_ENV === 'development' && item?.propertys?.webSite) {
            return item?.propertys?.webSite === 'https://srthcs1.gczhyun.com:21564/'
          } else if (item?.propertys?.gatewayHost || item?.propertys?.reviewGatewayHost) {
            return url === item?.propertys?.webSite?.split('/')?.slice(0, 3)?.join('/')
          } else if (item?.propertys?.webSite) {
            if (item?.propertys?.host) {
              return url === item?.propertys?.host?.split('/')?.slice(0, 3)?.join('/')
            } else {
              return url === item?.propertys?.webSite?.split('/')?.slice(0, 3)?.join('/')
            }
          } else {
            return undefined
          }
        }
      )
      if (currenServer && currenServer?.code) {
        // 是否查询到 服务器信息
        localStorage.setItem('serverCode', currenServer?.code || '')
        getNoticeReq(currenServer?.code, loginFuc, values, stopLoginFuc)
      } else {
        loginFuc(values)
      }
    })
    .catch(() => {
      loginFuc(values)
    })
}
const getNoticeReq = (
  code: string,
  loginFuc: CallableFunction,
  values: Login,
  stopLoginFuc?: CallableFunction
) => {
  getStopServerNotice({
    serverCode: code,
    kickOutSeconds: 605,
  })
    .then((res) => {
      if (res?.code !== 200) {
        loginFuc(values)
        return
      }
      const { data } = res
      const info = { ...values }
      if (data !== null && typeof data !== 'string') {
        if ([2, 3].includes(data?.stage) && info?.userName?.startsWith(data?.testerAccountPrefix)) {
          // 测试账号
          info.userName = info.userName.replace(data?.testerAccountPrefix, '') // 移除前缀
          sessionStorage.setItem('isTestUser', 'true')
          sessionStorage.setItem('stopServerInfo', JSON.stringify(data))
          loginFuc(info)
        } else if (data?.stage === 1) {
          // 公告期
          sessionStorage.setItem('isTestUser', 'false')
          sessionStorage.setItem('stopServerInfo', JSON.stringify(data))
          loginFuc(values)
        } else {
          // 预停服期和发版期,非测试账号
          stopLoginFuc?.(data)
          localStorage.setItem('Authorization', '')
          sessionStorage.setItem('isTestUser', 'false')
        }
      } else {
        loginFuc(values)
      }
    })
    .catch(() => {
      loginFuc(values)
    })
}

//移除自动填充
export const noAutoCompletePassword = {
  readOnly: true,
  onFocus: (e: any) => e.currentTarget.removeAttribute('readonly'),
}

//数字国际化显示 正则
export const thousandBitSeparator = (n: number) => {
  const re = /\d{1,3}(?=(\d{3})+$)/g
  const n1 = n.toString().replace(/^(\d+)((\.\d+)?)$/, (s, s1, s2) => {
    return s1.replace(re, '$&,') + s2
  })
  return n1
}

/**计算时间戳之差 */
export const intervalTime = (time: string) => {
  let dateTime = new Date(time)
  let dateNow = new Date() // 获取当前时间
  let timeDiff = dateNow.getTime() - dateTime.getTime() // 时间差的毫秒数
  // timeDiff = 时间戳差值

  let days = Math.floor(timeDiff / (24 * 3600 * 1000)) // 计算出天数
  let leavel1 = timeDiff % (24 * 3600 * 1000) // 计算天数后剩余的时间
  let hours = Math.floor(leavel1 / (3600 * 1000)) // 计算天数后剩余的小时数
  let leavel2 = timeDiff % (3600 * 1000) // 计算剩余小时后剩余的毫秒数
  let minutes = Math.floor(leavel2 / (60 * 1000)) // 计算剩余的分钟数
  return { days, hours, minutes }
}

/**获取当前日期 计算特定结束日期  */
export const getDefaultStartEndDate = () => {
  let endDate
  let lastDate
  let time = new Date()
  let month = time.getMonth() + 1
  let date = time.getDate()
  let year = time.getFullYear()
  let startDate = moment(time).format('YYYY-MM-DD')

  //处理结束日期：当天大于15号 则结束日期为下月15号
  if (date > 15) {
    if (month === 12) {
      month = 1
      year = year + 1
      endDate = [year, month, 15].join('-')
    } else {
      month = month + 1
      endDate = [year, month, 15].join('-')
    }
  } else {
    lastDate = new Date(year, month, 0).getDate()
    endDate = [year, month, lastDate].join('-')
  }
  return { startDate, endDate }
}

//中台接入获取各服务地址
export const getServiceIP = (api: string) => {
  if (api.includes('bbgl.gczhyun.com')) {
    return '172.2.48.22:31830'
  }
  if (api.includes('manage/v2')) {
    return '172.2.48.22:31805'
  }
  if (api.includes('monitor')) {
    return '172.2.48.22:31809'
  }

  if (api.includes('storage')) {
    return '172.2.48.33:31811'
  }
  if (api.includes('design')) {
    return '172.2.48.33:31817'
  }
  if (api.includes('review')) {
    return '172.2.48.33:31810'
  }
  if (api.includes('manage')) {
    return '172.2.48.22:31815'
  }
  if (api.includes('resourcemanage')) {
    return '172.2.48.33:31808'
  }
  if (api.includes('gridremediation')) {
    return '172.2.48.33:31803'
  }
  if (api.includes('quota')) {
    return '172.2.48.33:31807'
  }
  if (api.includes('technicaleconomy')) {
    return '172.2.48.244:31813'
  }
  if (api.includes('comment')) {
    return '172.2.48.244:31806'
  }
  if (api.includes('gridpredesign')) {
    return '172.2.48.244:31802'
  }

  if (api.includes('common')) {
    return '172.2.48.22:31801'
  }
  return
}

/**
 *
 * 管理端嵌客户端相关公用方法
 *
 */

//发送操作数据至客户端
export const postMsg = (actStr: string) => {
  window.chrome.webview.postMessage(actStr)
}

//浏览器or客户端判断
export const isBrowser = () => {
  return window.chrome.webview ? false : true
}

//客户端本地地址../dist
export const LOCAl_PATH = window.location.pathname.split('/index.html')[0]

export const getLocalPath = (path: string) => {
  return isBrowser() ? path : `${LOCAl_PATH}${path}`
}

// export const getJsonMap = (areaId: string) => {
//   return `${LOCAl_PATH}/json/${areaId}.json`
// }
