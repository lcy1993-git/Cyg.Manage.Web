import { Fill, Icon, Stroke, Style } from 'ol/style'
import CircleStyle from 'ol/style/Circle'

// 街道图层style
export const StreetLayerStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)',
  }),
  stroke: new Stroke({
    color: '#ffcc33',
    width: 2,
  }),
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({
      color: '#ffcc33',
    }),
  }),
})

// vector层Style
export const vectorLayerStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)',
  }),
  stroke: new Stroke({
    color: '#ffcc33',
    width: 2,
  }),
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({
      color: '#ffcc33',
    }),
  }),
})

export const featureStyle: Record<string, () => Icon | Style> = {
  // 虚线
  type1: () =>
    new Style({
      stroke: new Stroke({
        lineDash:[1,2,3,4,5,6],
        color: '#0044CC',
        width: 4
      })
    }),
  type2: () =>
    new Icon({
      crossOrigin: 'anonymous',
      src: 'data/bigdot.png',
      scale: 0.2,
    }),
  type3: () =>
    new Icon({
      crossOrigin: 'anonymous',
      src: 'data/bigdot.png',
      scale: 0.2,
    }),
}
