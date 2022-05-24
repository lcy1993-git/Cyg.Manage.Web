import { Icon, Style } from 'ol/style'

export const pointStyle = (type: string, selected: boolean = false) => {
  let iconUrl
  let color = selected ? `rgba(8,210,42,1)` : `rgba(189,206,198,1)`
  // 根据点位的类型设置图符
  switch (type) {
    case 'tower':
      iconUrl = ''
      break

    default:
      break
  }
  let imgStyle = new Style({
    image: new Icon({
      src: iconUrl,
      color,
      scale: 1,
      // size: [24, 24], // 图片大小
      // anchor: [11, 11] // 图片位置
    }),
    zIndex: selected ? 100 : 3,
  })
  return imgStyle
}
