// 第一次进入页面当前枚举值请求尚未在本地

const loadEnumsData = window.localStorage.getItem('loadEnumsData')
const data = loadEnumsData && loadEnumsData !== 'undefined' ? JSON.parse(loadEnumsData) : null
export interface EnumItem {
  key: string
  value: EnumValue[]
}

export interface EnumValue {
  value: number
  text: string
}
/**
 * 根据localstorage loadEnumsData获取<枚举数字,枚举中文>的map
 * @param type 枚举类型，自行在控制台中查看根据localstorage loadEnums的类型有哪些
 * @returns
 */
export const findEnumKeyByType = (type: string): Map<number, string> => {
  const res = data
    .find((enumItem: EnumItem) => enumItem.key === type)
    .value.map((e: EnumValue) => [e.value, e.text])
  return new Map<number, string>(res)
}

/**
 *
 * @param chEnum 中文枚举值
 * @param type 本地枚举值的类型 可以打开控制台看一下localstorage里面存的内容
 * @returns
 */
export const findEnumKeyByCN = (chEnum: string, type: string): number =>
  (data || [])
    .find((enumItem: EnumItem) => enumItem.key === type)
    ?.value.find((value: EnumValue) => value.text === chEnum)?.value
