/**
 * 获取样式
 * @param type 类型
 * @param value 值
 */
export const getStyle = (type: string, value: any) => {
  let style
  switch (type) {
    case 'tower':
      style = getTowerStyle(value)
      break
    case 'cable':
      style = getCableStyle(value)
      break
    case 'cableEquipment':
      style = getCableEquipmentSyle(value)
      break
    case 'transformer':
      style = getTransformerStyle(value)
      break
    case 'faultIndicator':
      style = getFaultIndicatorStyle(value)
      break
    case 'hole':
      style = getHoleStyle()
      break
    case 'mark':
      style = getMarkStyle(value)
      break
    case 'brace':
      style = getBraceStyle()
      break
    case 'pullLine':
      style = getPullLineStyle(value)
      break
    case 'electricMeter':
      style = getElectricMeterStyle(value)
      break
    case 'overHeadDevice':
      style = getOverHeadDeviceStyle(value)
      break
    case 'cableHead':
      style = getCableHeadStyle(value)
      break
    case 'crossArm':
      style = getCrossArmStyle(value)
      break
    default:
      break
  }
  return style
}

/**
 * 获取方位角
 * @param type azimuth
 */
export const getAzimuth = (type: string, azimuth: any) => {
  var azimuth_: any = azimuth ? azimuth : 0
  switch (type) {
    case 'pullLine':
      azimuth_ = (azimuth_ + 90) * -1
      break
    // case 'electricMeter':
    //   azimuth_ = azimuth_ * -1
    //   break
    // case 'overHeadDevice':
    //   azimuth_ = (azimuth_ - 45) * -1
    //   break
    // case 'cableHead':
    //   azimuth_ = azimuth_ * -1
    // break
    default:
      azimuth_ = azimuth_ * -1
      break
  }
  return azimuth_
}

/**
 * 获取杆塔样式
 * @param symbol_id 杆塔是根据symbolId来进行分类的
 */
const getTowerStyle = (symbol_id: any) => {
  let imgUrl
  try {
    imgUrl = require(`./image/tower_${symbol_id}.png`)
  } catch (error) {
    imgUrl = require(`./image/tower.png`)
  }
  return imgUrl
}

/**
 * 获取电缆井样式
 * @param symbol_id 电缆井是根据symbolId来进行分类的
 */
const getCableStyle = (symbol_id: any) => {
  let imgUrl
  try {
    imgUrl = require(`./image/cable_${symbol_id}.png`)
  } catch (error) {
    imgUrl = require(`./image/cable.png`)
  }
  return imgUrl
}

/**
 * 获取电力设备样式
 * @param symbol_id 电力设备是根据symbolId来进行分类的
 */
const getCableEquipmentSyle = (symbol_id: any) => {
  let imgUrl
  try {
    imgUrl = require(`./image/cableEquipment_${symbol_id}.png`)
  } catch (error) {
    imgUrl = require(`./image/cableEquipment.png`)
  }
  return imgUrl
}

/**
 * 获取变压器样式
 * @param symbol_id 变压器是根据symbolId来进行分类的
 * @returns
 */
const getTransformerStyle = (symbol_id: any) => {
  let imgUrl
  try {
    imgUrl = require(`./image/transformer_${symbol_id}.png`)
  } catch (error) {
    imgUrl = require(`./image/transformer.png`)
  }
  return imgUrl
}

/**
 * 获取故障指示器样式
 * @param state
 */
const getFaultIndicatorStyle = (state: any) => {
  let imgUrl
  try {
    imgUrl = require(`./image/faultIndicator_${state}.png`)
  } catch (error) {
    imgUrl = require(`./image/faultIndicator.png`)
  }
  return imgUrl
}

/**
 * 获取穿孔样式
 * @returns
 */
const getHoleStyle = () => {
  return require(`./image/hole.png`)
}

/**
 * 获取地物样式
 * @param type
 * @returns
 */
const getMarkStyle = (type: any) => {
  let imgUrl
  try {
    imgUrl = require(`./image/mark_${type}.png`)
  } catch (error) {
    imgUrl = require(`./image/mark.png`)
  }
  return imgUrl
}

/**
 * 获取支架样式
 */
const getBraceStyle = () => {
  return require(`./image/brace.png`)
}

/**
 * 获取水平拉线样式
 * @param type
 */
const getPullLineStyle = (type: any) => {
  let imgUrl
  try {
    imgUrl = require(`./image/pullLine_${type}.png`)
  } catch (error) {
    imgUrl = require(`./image/pullLine.png`)
  }
  return imgUrl
}

/**
 * 获取户表样式
 * @param type
 */
const getElectricMeterStyle = (typeAndState: any) => {
  let imgUrl
  try {
    imgUrl = require(`./image/electricMeter_${typeAndState}.png`)
  } catch (error) {
    imgUrl = require(`./image/electricMeter.png`)
  }
  return imgUrl
}

/**
 * 获取杆上设备样式
 * @param type
 */
const getOverHeadDeviceStyle = (typeAndState: any) => {
  let imgUrl
  try {
    imgUrl = require(`./image/overHeadDevice_${typeAndState}.png`)
  } catch (error) {
    imgUrl = require(`./image/overHeadDevice.png`)
  }
  return imgUrl
}

/**
 * 获取电缆头样式
 * @param type
 */
const getCableHeadStyle = (value: any) => {
  const arr = value.split('_')
  const type = arr[0]
  // const state = arr[1]
  const kvLevle = arr[2]
  let imgUrl
  try {
    if (type === '电缆终端') {
      imgUrl = require(`./image/cableHead_${value}.png`)
    } else {
      imgUrl = require(`./image/cableHead_${type}_${kvLevle}.png`)
    }
  } catch (error) {
    imgUrl = require(`./image/cableHead.png`)
  }
  return imgUrl
}

const getCrossArmStyle = (value: any) => {
  const arr = value.split('_')
  const type = arr[0]
  const state = arr[1]
  let imgUrl
  try {
    if (type === '两线墙装门型支架' || type === '四线墙装门型支架') {
      imgUrl = require(`./image/crossArm_24_${state}.png`)
    } else {
      imgUrl = require(`./image/crossArm_not24_${state}.png`)
    }
  } catch (error) {
    imgUrl = require(`./image/crossArm.png`)
  }
  return imgUrl
}
