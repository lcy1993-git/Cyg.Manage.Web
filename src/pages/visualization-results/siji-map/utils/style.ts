/**
 * 获取杆塔样式
 * @param symbol_id 杆塔是根据symbolId来进行分类的
 */
export const getTowerStyle = (symbol_id: any) => {
  let imgUrl: string = ''
  switch (symbol_id.toString()) {
    case '0':
      imgUrl = ''
      break
    case '111':
      imgUrl = ''
      break
    case '112':
      imgUrl = ''
      break
    case '113':
      imgUrl = ''
      break
    case '114':
      imgUrl = ''
      break
    case '115':
      imgUrl = ''
      break

    case '121':
      imgUrl = ''
      break
    case '122':
      imgUrl = ''
      break
    case '123':
      imgUrl = ''
      break
    case '124':
      imgUrl = ''
      break
    case '125':
      imgUrl = ''
      break

    case '131':
      imgUrl = ''
      break
    case '132':
      imgUrl = ''
      break
    case '133':
      imgUrl = ''
      break
    case '134':
      imgUrl = ''
      break
    case '135':
      imgUrl = ''
      break

    case '141':
      imgUrl = ''
      break
    case '142':
      imgUrl = ''
      break
    case '143':
      imgUrl = ''
      break
    case '144':
      imgUrl = ''
      break
    case '145':
      imgUrl = ''
      break
    default:
      imgUrl = ''
  }
  return imgUrl
}
