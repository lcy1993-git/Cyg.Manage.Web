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
  let imgUrl: string = ''
  switch (symbol_id.toString()) {
    case '0':
      imgUrl = '#FF0000'
      break
    case '111':
      imgUrl = '#BA55D3'
      break
    case '112':
      imgUrl = '#DA70D6'
      break
    case '113':
      imgUrl = '#90EE90'
      break
    case '114':
      imgUrl = '#00FF00'
      break
    case '115':
      imgUrl = '#FFD700'
      break

    case '121':
      imgUrl = '#FFA500'
      break
    case '122':
      imgUrl = '#FFE4C4'
      break
    case '123':
      imgUrl = '#A0522D'
      break
    case '124':
      imgUrl = '#FF4500'
      break
    case '125':
      imgUrl = '#FA8072'
      break

    case '131':
      imgUrl = '#C71585'
      break
    case '132':
      imgUrl = '#DA70D6'
      break
    case '133':
      imgUrl = '#FF00FF'
      break
    case '134':
      imgUrl = '#4B0082'
      break
    case '135':
      imgUrl = '#483D8B'
      break

    case '141':
      imgUrl = '#1E90FF'
      break
    case '142':
      imgUrl = '#F0F8FF'
      break
    case '143':
      imgUrl = '#4682B4'
      break
    case '144':
      imgUrl = '#87CEFA'
      break
    case '145':
      imgUrl = '#00BFFF'
      break
    default:
      imgUrl = '#FF0000'
  }
  return imgUrl
}

/**
 * 获取电缆井样式
 * @param symbol_id 电缆井是根据symbolId来进行分类的
 */
const getCableStyle = (symbol_id: any) => {
  let imgUrl: string = ''
  switch (symbol_id.toString()) {
    case '111':
      imgUrl = '#BA55D3'
      break
    case '112':
      imgUrl = '#DA70D6'
      break
    case '113':
      imgUrl = '#90EE90'
      break
    case '114':
      imgUrl = '#00FF00'
      break

    case '121':
      imgUrl = '#FFA500'
      break
    case '122':
      imgUrl = '#FFE4C4'
      break
    case '123':
      imgUrl = '#A0522D'
      break
    case '124':
      imgUrl = '#FF4500'
      break

    case '131':
      imgUrl = '#C71585'
      break
    case '132':
      imgUrl = '#DA70D6'
      break
    case '133':
      imgUrl = '#FF00FF'
      break
    case '134':
      imgUrl = '#4B0082'
      break

    case '141':
      imgUrl = '#1E90FF'
      break
    case '142':
      imgUrl = '#F0F8FF'
      break
    case '143':
      imgUrl = '#4682B4'
      break
    case '144':
      imgUrl = '#87CEFA'
      break

    default:
      imgUrl = '#FF0000'
  }
  return imgUrl
}

/**
 * 获取电力设备样式
 * @param symbol_id 电力设备是根据symbolId来进行分类的
 */
const getCableEquipmentSyle = (symbol_id: any) => {
  let imgUrl: string = ''
  switch (symbol_id.toString()) {
    case '111':
      imgUrl = '#BA55D3'
      break
    case '112':
      imgUrl = '#DA70D6'
      break
    case '113':
      imgUrl = '#90EE90'
      break
    case '114':
      imgUrl = '#00FF00'
      break

    case '121':
      imgUrl = '#FFA500'
      break
    case '122':
      imgUrl = '#FFE4C4'
      break
    case '123':
      imgUrl = '#A0522D'
      break
    case '124':
      imgUrl = '#FF4500'
      break

    case '131':
      imgUrl = '#C71585'
      break
    case '132':
      imgUrl = '#DA70D6'
      break
    case '133':
      imgUrl = '#FF00FF'
      break
    case '134':
      imgUrl = '#4B0082'
      break

    case '141':
      imgUrl = '#1E90FF'
      break
    case '142':
      imgUrl = '#F0F8FF'
      break
    case '143':
      imgUrl = '#4682B4'
      break
    case '144':
      imgUrl = '#87CEFA'
      break

    case '151':
      imgUrl = '#BA55D3'
      break
    case '152':
      imgUrl = '#DA70D6'
      break
    case '153':
      imgUrl = '#90EE90'
      break
    case '154':
      imgUrl = '#00FF00'
      break

    case '161':
      imgUrl = '#FFA500'
      break
    case '162':
      imgUrl = '#FFE4C4'
      break
    case '163':
      imgUrl = '#A0522D'
      break
    case '164':
      imgUrl = '#FF4500'
      break

    case '171':
      imgUrl = '#C71585'
      break
    case '172':
      imgUrl = '#DA70D6'
      break
    case '173':
      imgUrl = '#FF00FF'
      break
    case '174':
      imgUrl = '#4B0082'
      break

    case '181':
      imgUrl = '#1E90FF'
      break
    case '182':
      imgUrl = '#F0F8FF'
      break
    case '183':
      imgUrl = '#4682B4'
      break
    case '184':
      imgUrl = '#87CEFA'
      break

    default:
      imgUrl = '#FF0000'
  }
  return imgUrl
}

/**
 * 获取变压器样式
 * @param symbol_id 变压器是根据symbolId来进行分类的
 * @returns
 */
const getTransformerStyle = (symbol_id: any) => {
  let imgUrl: string = ''
  switch (symbol_id.toString()) {
    case '11':
      imgUrl = '#BA55D3'
      break
    case '12':
      imgUrl = '#DA70D6'
      break
    case '13':
      imgUrl = '#90EE90'
      break
    case '14':
      imgUrl = '#00FF00'
      break
    default:
      imgUrl = '#FF0000'
  }
  return imgUrl
}

/**
 * 获取故障指示器样式
 * @param state
 */
const getFaultIndicatorStyle = (state: any) => {
  let imgUrl: string = ''
  switch (state.toString()) {
    case '1':
      imgUrl = '#BA55D3'
      break
    case '2':
      imgUrl = '#DA70D6'
      break
    case '3':
      imgUrl = '#90EE90'
      break
    case '4':
      imgUrl = '#00FF00'
      break
    default:
      imgUrl = '#FF0000'
  }
  return imgUrl
}

/**
 * 获取穿孔样式
 * @returns
 */
const getHoleStyle = () => {
  let imgUrl: string = '#BA55D3'
  return imgUrl
}

/**
 * 获取地物样式
 * @param type
 * @returns
 */
const getMarkStyle = (type: any) => {
  let imgUrl
  switch (type.toString()) {
    case '1':
      imgUrl = 'red'
      break
    case '2':
      imgUrl = 'red'
      break
    case '3':
      imgUrl = 'red'
      break
    case '4':
      imgUrl = 'red'
      break
    case '5':
      imgUrl = 'red'
      break
    case '6':
      imgUrl = 'red'
      break
    case '7':
      imgUrl = 'red'
      break
    default:
      imgUrl = 'red'
  }
  return imgUrl
}

/**
 * 获取支架样式
 */
const getBraceStyle = () => {
  let imgUrl: string = 'blue'
  return imgUrl
}

/**
 * 获取水平拉线样式
 * @param type
 */
const getPullLine = (type: any) => {
  let imgUrl = type && type === 1 ? 'blue' : 'red'
  return imgUrl
}
