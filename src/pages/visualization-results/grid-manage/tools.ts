/** 工具文件 **/

/** 左侧菜单宽度 **/
export const LEFTMENUWIDTH = 260

/** 校验纬度 */
export const verificationLat = () => ({
  validator: (_: any, value: string, callback: any) => {
    const reg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,15}|90\.0{0,15}|[0-8]?\d{1}|90)$/
    if (value === '' || !value) {
      callback()
    } else {
      if (!reg.test(value)) {
        callback(new Error('纬度范围：-90~90（保留小数点后十五位）'))
      }
      callback()
    }
  },
})

/** 校验经度 */
export const verificationLng = () => ({
  validator: (_: any, value: string, callback: any) => {
    const reg =
      /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,15})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,15}|180)$/
    if (value === '' || !value) {
      callback()
    } else {
      if (!reg.test(value)) {
        callback(new Error('经度范围：-180~180（保留小数点后十五位）'))
      }
      callback()
    }
  },
})

/**  校验自然数 0,1,2,3,4 ... Infinity */
export const verificationNaturalNumber = () => ({
  validator(_: any, value: string) {
    // const reg = /^((\d|[123456789]\d)(\.\d+)?|100)$/ 0到100的正整数 包含0 和100
    if (!value && Number(value) !== 0) {
      return Promise.reject(new Error('请输入0或正整数'))
    }
    const reg = /^([0]|[1-9][0-9]*)$/
    if (reg.test(value)) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('请输入0或正整数'))
  },
})

/**  校验0到100的自然数 */
export const verificationNaturalNumber0to100 = () => ({
  validator(_: any, value: string) {
    if (!value && Number(value) !== 0) {
      return Promise.reject(new Error('请输入0到100的自然数'))
    }
    // const reg = /^([0]|[1-9][0-9]*)$/
    const reg = /^((\d|[123456789]\d)(\.\d+)?|100)$/
    if (reg.test(value)) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('请输入0到100的自然数'))
  },
})
