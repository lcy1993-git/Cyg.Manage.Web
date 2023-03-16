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
      style = getPullLine(value)
      break
    default:
      break
  }
  return style
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
const getPullLine = (type: any) => {
  let imgUrl = type && type === 1 ? 'blue' : 'red'
  return imgUrl
}
