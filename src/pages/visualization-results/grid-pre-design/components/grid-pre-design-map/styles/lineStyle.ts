import { Stroke, Style } from 'ol/style'

const lineStyle = {
  无类型: new Style({
    stroke: new Stroke({
      //lineJoin:'bevel',
      // lineDash: [1, 2, 3, 4, 5, 6],
      color: '#1294d0',
      width: 2,
    }),
  }),
  架空线: new Style({
    stroke: new Stroke({
      //lineJoin:'bevel',
      lineDash: [2, 6],
      color: '#1294d0',
      width: 2,
    }),
  }),
  电缆: new Style({
    stroke: new Stroke({
      //lineJoin:'bevel',
      lineDash: [1, 3],
      color: '#1294d0',
      width: 2,
    }),
  }),
}

export default lineStyle
