import { getTechnicalEconomyEnums } from '@/services/technology-economic'
export interface EnumsType {
  value: number | string
  text: string
}
interface ResData {
  name: string
  code: string
  items: EnumsType[]
}

const findItems = (resData: ResData[], name: string, isChineseName = false) => {
  return resData.find((item: ResData) => {
    if (isChineseName) {
      return item.name === name
    }
    return item.code === name
  })
}

/**
 * 获取技经所有枚举值
 * @param name 枚举值名
 * @param isChineseName 是否使用中文名获取枚举  默认为false
 * @demo   (getEnums('AreaType'));
 * @demo   (getEnums('地区类型', true));
 * @returns Map[]
 */
export const getEnums = (name: string, isChineseName?: boolean) => {
  const technologyEconomicEnums = localStorage.getItem('technologyEconomicEnums')
  if (technologyEconomicEnums) {
    const parse = JSON.parse(technologyEconomicEnums || '')

    if (typeof parse === 'object' && parse != null) {
      return findItems(parse, name, isChineseName)?.items
    }
  } else {
    getTechnicalEconomyEnums().then((resData) => {
      if (Array.isArray(resData)) {
        localStorage.setItem('technologyEconomicEnums', JSON.stringify(resData))
        getEnums(name, isChineseName)
      }
    })
  }
  return
}

export const getTypeByText = (text: string) => {
  return Object(Object(getEnums('RateTableType'))?.find((item: EnumsType) => item.text === text))
    ?.value
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
