import { Fill, Icon, Stroke, Style, Text } from 'ol/style'

export const pointStyle = (data: any, selected: boolean = false) => {
  let iconUrl
  let color = selected ? `rgba(8,210,42,1)` : `rgba(189,206,198,1)`
  // 根据点位的类型设置图符
  switch (data.type) {
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

export const lineStyle = (data: any, selected: boolean = false) => {
  let color,
    width = 1,
    zIndex = 2
  switch (data.type) {
    case 'line':
      color = ''
      width = 2
      break

    default:
      break
  }
  let text = data.length ? data.length.toFixed(2) + 'm' : ''
  let style = new Style({
    stroke: new Stroke({
      color,
      lineCap: 'butt',
      width,
    }),
    fill: new Fill({
      color,
    }),
    text: new Text({
      font: '12px Source Han Sans SC',
      text,
      placement: 'line',
      textAlign: 'center',
      fill: new Fill({
        //文字填充色
        color: `rgba(255,255,255,1)`,
      }),
      stroke: new Stroke({
        //文字边界宽度与颜色
        color: `rgba(0,0,0,1)`,
        width: 2,
      }),
    }),
    zIndex: 2,
  })
  return style
}
