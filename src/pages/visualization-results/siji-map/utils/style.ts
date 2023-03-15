/**
 * 获取样式
 * @param type 类型
 * @param value 值
 */
export const getStyle = (type: string, value: any) => {
  switch (type) {
    case 'tower':
      getTowerStyle(value)
      break

    default:
      break
  }
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
