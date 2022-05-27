import { Feature } from 'ol'
import { Coordinate } from 'ol/coordinate'
import { LineString, Point } from 'ol/geom'
import Geometry from 'ol/geom/Geometry'
import { Draw, Modify, Snap } from 'ol/interaction'
import { CABLECIRCUIT, CABLEWELL, LINE, TOWER } from '../../DrawToolbar/GridUtils'
import { getLayer } from './loadLayer'
import { lineStyle, pointStyle } from './style'
class DrawTool {
  map: any
  options: any
  select: any
  draw: any
  snap: any
  modify: any
  source: any

  constructor(map: any, options: any) {
    this.map = map
    this.options = options
    // this.addDraw(this.source, this.options.type_)
    // this.addSnap(this.source)
  }

  setSource(source: any) {
    this.source = source
  }

  drawGeometry(options: any) {
    this.options = options
    this.draw && this.map.removeInteraction(this.draw)
    this.snap && this.map.removeInteraction(this.snap)
    this.addDraw(this.options.type_)
    this.addSnap()
  }

  addDraw = (type: string) => {
    this.draw = new Draw({
      source: this.source,
      type,
    })
    this.map.addInteraction(this.draw)
    let this_ = this
    this.draw.on('drawabort ', function (e: any) {})

    this.draw.on('drawstart', function (e: any) {
      // console.log(this_.source.getFeatures())
    })

    this.draw.on('drawend', function (e: any) {
      e.feature.set('data', this_.options)
      if (e.feature.getGeometry().getType() === 'LineString') {
        e.feature.setStyle(lineStyle(this_.options))
        this_.handleLine(this_.source, e.feature)
      } else e.feature.setStyle(pointStyle(this_.options))
    })
  }

  addSnap = () => {
    this.snap = new Snap({ source: this.source })
    this.map.addInteraction(this.snap)
  }

  addModify = () => {
    this.modify = new Modify({ source: this.source })
    this.map.addInteraction(this.modify)
  }

  handleLine = (source: any, feature: any) => {
    setTimeout(() => {
      // 获取绘制点点位信息数组
      const coordinates = feature.getGeometry().getCoordinates() as Coordinate[]
      const features = coordinates.reduce((pre: Feature<Geometry>[], [x, y], index, origin) => {
        if (!origin[index + 1]) return pre
        let nextPonintX = origin[index + 1][0]
        let nextPonintY = origin[index + 1][1]

        const node1: any = this.handleLine_node(x, y, feature.get('data').featureType)
        if (node1) {
          x = node1.getGeometry().getCoordinates()[0]
          y = node1.getGeometry().getCoordinates()[1]
        }

        const node2: any = this.handleLine_node(
          nextPonintX,
          nextPonintY,
          feature.get('data').featureType
        )
        if (node2) {
          nextPonintX = node2.getGeometry().getCoordinates()[0]
          nextPonintY = node2.getGeometry().getCoordinates()[1]
        }

        const lineString = new LineString([
          [x, y],
          [nextPonintX, nextPonintY],
        ])
        const feature_ = new Feature(lineString)
        feature_.set('data', feature.get('data'))
        feature_.setStyle(lineStyle(feature.get('data')))
        return pre.concat(feature_)
      }, [])
      // 移除原有要素层
      source.removeFeature(feature)
      // 将拆分生成的新要素层添加至图层
      source.addFeatures(features)
    }, 0)
  }

  handleLine_node = (lont: number, lat: number, featureType: string) => {
    let node
    let pixel = this.map.getPixelFromCoordinate([lont, lat])
    this.map.forEachFeatureAtPixel(pixel, function (feature: any, layer: any) {
      if (layer.get('name') === 'pointLayer') node = feature
    })
    if (!node) {
      let pointLayer = getLayer(this.map, 'pointLayer', 3)
      let point = new Point([lont, lat])
      const feature = new Feature(point)
      if (featureType === LINE) {
        feature.setStyle(pointStyle({ featureType: TOWER }))
      } else if (featureType === CABLECIRCUIT) {
        feature.setStyle(pointStyle({ featureType: CABLEWELL }))
      }
      pointLayer.getSource().addFeature(feature)
    }
    return node
  }
}

export default DrawTool
