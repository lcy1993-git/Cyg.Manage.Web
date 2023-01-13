import { getProductServerList, getStopServerNotice } from '@/services/index'
import { MaterialDataType } from '@/services/visualization-results/list-menu'

const { NODE_ENV } = process.env

/**
 *  @param treeData 需要平铺的树状数据
 *  @param childName 儿子数组的名称
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
 * @param getProperties
 * @returns
 */
export const formDataMateral = (content: any, getProperties: any) => {
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
  const typeSet: Set<string> = new Set(
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
 * @param content
 * @param getProperties
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

export const productCode = '1301726010322214912'

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
        (item: { propertys: { webSite: string; host: string | null } }) => {
          if (NODE_ENV === 'development' && item?.propertys?.webSite) {
            return item?.propertys?.webSite === 'https://srthkf2.gczhyun.com:21530/login'
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
