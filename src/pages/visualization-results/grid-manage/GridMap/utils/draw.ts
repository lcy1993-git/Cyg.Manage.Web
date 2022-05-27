import { Feature } from 'ol'
import { Coordinate } from 'ol/coordinate'
import WKT from 'ol/format/WKT'
import { LineString, Point } from 'ol/geom'
import Geometry from 'ol/geom/Geometry'
import { Draw, Snap } from 'ol/interaction'
import { transform } from 'ol/proj'
import { CABLECIRCUIT, CABLEWELL, LINE, TOWER } from '../../DrawToolbar/GridUtils'
import { getLayer } from './loadLayer'
import { setSelectActive } from './select'
import { lineStyle, pointStyle } from './style'
class DrawTool {
  map: any
  options: any
  draw: any
  snap: any
  selset: any
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
    setSelectActive(false)
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
      } else {
        e.feature.setStyle(pointStyle(this_.options))
        const coordinates = e.feature.getGeometry().getCoordinates()
        const lont = transform(coordinates, 'EPSG:3857', 'EPSG:4326')
        this_.options.lng = lont[0]
        this_.options.lat = lont[1]
        var format = new WKT()
        this_.options.geom = format.writeGeometry(e.feature.getGeometry())
        // 添加点位到数据库 this_.options
      }
    })
  }

  addSnap = () => {
    this.snap = new Snap({ source: this.source })
    this.map.addInteraction(this.snap)
  }

  handleLine = (source: any, feature: any) => {
    setTimeout(() => {
      // 获取绘制点点位信息数组
      const coordinates = feature.getGeometry().getCoordinates() as Coordinate[]
      const features = coordinates.reduce((pre: Feature<Geometry>[], [x, y], index, origin) => {
        if (!origin[index + 1]) return pre
        let nextPonintX = origin[index + 1][0]
        let nextPonintY = origin[index + 1][1]

        const node1: any = this.handleLine_node(x, y, feature.get('data').featureType, true)
        if (node1) {
          x = node1.getGeometry().getCoordinates()[0]
          y = node1.getGeometry().getCoordinates()[1]
        }

        let isAdd = false
        if (index === coordinates.length - 2) isAdd = true
        const node2: any = this.handleLine_node(
          nextPonintX,
          nextPonintY,
          feature.get('data').featureType,
          isAdd
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
        var format = new WKT()
        feature.get('data').geom = format.writeGeometry(lineString)
        // 添加线路到数据库 feature.get('data')

        return pre.concat(feature_)
      }, [])
      // 移除原有要素层
      source.removeFeature(feature)
      // 将拆分生成的新要素层添加至图层
      source.addFeatures(features)
    }, 0)
  }

  handleLine_node = (lont: number, lat: number, featureType: string, isAdd: boolean) => {
    let node
    let pixel = this.map.getPixelFromCoordinate([lont, lat])
    this.map.forEachFeatureAtPixel(pixel, function (feature: any, layer: any) {
      if (layer.get('name') === 'pointLayer') node = feature
    })
    if (!node && isAdd) {
      let pointLayer = getLayer(this.map, 'pointLayer', 3)
      let point = new Point([lont, lat])
      const feature = new Feature(point)
      const data: any = {}
      const coordinates = point.getCoordinates()
      const lont_ = transform(coordinates, 'EPSG:3857', 'EPSG:4326')
      data.lng = lont_[0]
      data.lat = lont_[1]
      var format = new WKT()
      data.geom = format.writeGeometry(point)

      if (featureType === LINE) {
        data.featureType = TOWER
        feature.setStyle(pointStyle(data))
      } else if (featureType === CABLECIRCUIT) {
        data.featureType = CABLEWELL
        feature.setStyle(pointStyle(data))
      }

      feature.set('data', data)
      pointLayer.getSource().addFeature(feature)

      // 添加点位到数据库 data
    }
    return node
  }
}

export default DrawTool
