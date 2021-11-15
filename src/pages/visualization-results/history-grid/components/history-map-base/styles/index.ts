import img from '@/assets/icon-image/survey-track-light.png'
import { Fill, Icon, Stroke, Style } from 'ol/style'
import CircleStyle from 'ol/style/Circle'
import lineStyle from './lineStyle'
import modifyStyle from './modifyStyle'
import pointStyle from './pointStyle'

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
    color: '#0044CC',
  }),
  stroke: new Stroke({
    lineDash: [1, 2, 3, 4, 5, 6],
    width: 3,
    color: [255, 0, 0, 1],
  }),
  // image: new CircleStyle({
  //   radius: 7,
  //   fill: new Fill({
  //     color: '#ffcc33',
  //   }),
  // }),
})

export const featureStyle: Record<string, Style> = {
  // 虚线
  type1: new Style({
    fill: new Fill({
      color: '#0044CC',
    }),
    stroke: new Stroke({
      //lineJoin:'bevel',
      lineDash: [1, 2, 3, 4, 5, 6],
      color: '#0044CC',
      width: 4,
    }),
  }),
  type2: new Style({
    image: new Icon({
      anchor: [0.5, 46],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: img,
      scale: 0.8,
    }),
  }),
  typeTest: new Style({
    fill: new Fill({
      color: '#0044CC',
    }),
    stroke: new Stroke({
      //lineJoin:'bevel',
      lineDash: [1, 2, 3, 4, 5, 6],
      color: '#FF0000',
      width: 4,
    }),
  }),
  // type3:
  //   new Icon({
  //     crossOrigin: 'anonymous',
  //     src: 'data/bigdot.png',
  //     scale: 0.2,
  //   }),
}

export { modifyStyle, lineStyle, pointStyle }
