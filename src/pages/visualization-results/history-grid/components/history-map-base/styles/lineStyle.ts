import { Stroke, Style } from 'ol/style'

const lineStyle = {
  无类型: new Style({
    stroke: new Stroke({
      //lineJoin:'bevel',
      // lineDash: [1, 2, 3, 4, 5, 6],
      color: '#1294d0',
      width: 4,
    }),
  }),
  架空线: new Style({
    stroke: new Stroke({
      //lineJoin:'bevel',
      lineDash: [20, 15],
      color: '#1294d0',
      width: 4,
    }),
  }),
  电缆: new Style({
    stroke: new Stroke({
      //lineJoin:'bevel',
      lineDash: [4, 6, 4, 6],
      color: '#1294d0',
      width: 4,
    }),
  }),
}

export default lineStyle
