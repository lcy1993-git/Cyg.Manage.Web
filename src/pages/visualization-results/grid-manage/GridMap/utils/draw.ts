import { Feature } from 'ol'
import { Coordinate } from 'ol/coordinate'
import WKT from 'ol/format/WKT'
import { LineString, Point } from 'ol/geom'
import Geometry from 'ol/geom/Geometry'
import { Draw, Snap } from 'ol/interaction'
import { transform } from 'ol/proj'
import { CABLECIRCUIT, CABLEWELL, LINE, TOWER, TYPENUMS } from '../../DrawToolbar/GridUtils'
import { createFeatureId } from './../../DrawToolbar/GridUtils'
import { getLayer } from './loadLayer'
import { calculationLine } from './multiloop'
import { setSelectActive } from './select'
import { lineStyle, pointStyle } from './style'
class DrawTool {
  map: any
  options: any
  draw: any
  snap: any
  translate: any
  source: any
  gridManageData: any[]
  constructor(map: any, options: any) {
    this.map = map
    this.options = options
    this.gridManageData = []
    // this.addDraw(this.source, this.options.type_)
    // this.addSnap(this.source)
  }

  setSource(source: any) {
    this.source = source
  }

  drawGeometry(options: any, clickEvent: any) {
    if (options.lng && options.lat) {
      options.lng = parseFloat(options.lng)
      options.lat = parseFloat(options.lat)
      const point = new Point([options.lng, options.lat]).transform('EPSG:4326', 'EPSG:3857')
      const feature: any = new Feature(point)

      feature.setStyle(pointStyle(options, false, this.map.getView().getZoom(), true))
      var format = new WKT()
      options.geom = format.writeGeometry(
        feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326')
      )
      feature.set('data', options)
      this.source.addFeature(feature)
      return
    }
    setSelectActive(false)
    this.options = options
    this.draw && this.map.removeInteraction(this.draw)
    this.snap && this.map.removeInteraction(this.snap)
    this.addDraw(this.options.type_, clickEvent)
    this.addSnap()
  }

  getAllDrawPoints() {
    let featrues: any = []
    let pointLayer = getLayer(this.map, 'pointLayer')
    pointLayer
      .getSource()
      .getFeatures()
      .forEach((feature: any) => {
        if (feature.get('data').type_ === 'Point') {
          featrues.push(feature.get('data'))
          feature.get('data').type_ = 'saveEnd'
        }
      })
    return featrues
  }

  getAllDrawLines() {
    let featrues: any = []
    let lineLayer = getLayer(this.map, 'lineLayer')
    lineLayer
      .getSource()
      .getFeatures()
      .forEach((feature: any) => {
        if (feature.get('data').type_ === 'LineString') {
          featrues.push(feature.get('data'))
          feature.get('data').type_ = 'saveEnd'
        }
      })
    return featrues
  }

  deleteAll() {
    let pointLayer = getLayer(this.map, 'pointLayer')
    pointLayer
      .getSource()
      .getFeatures()
      .forEach((feature: any) => {
        if (feature.get('data').type_ === 'Point') pointLayer.getSource().removeFeature(feature)
      })

    let lineLayer = getLayer(this.map, 'lineLayer')
    lineLayer
      .getSource()
      .getFeatures()
      .forEach((feature: any) => {
        if (feature.get('data').type_ === 'LineString') lineLayer.getSource().removeFeature(feature)
      })
  }

  addDraw = (type: string, clickEvent: any) => {
    this.draw = new Draw({
      source: this.source,
      type,
    })
    this.map.addInteraction(this.draw)
    let this_ = this
    this.draw.on('drawabort ', function (e: any) {})

    this.draw.on('drawstart', function (e: any) {})

    this.draw.on('drawend', function (e: any) {
      e.feature.set('data', this_.options)
      if (e.feature.getGeometry().getType() === 'LineString') {
        this_.handleLine(this_.source, e.feature)
      } else if (e.feature.getGeometry().getType() === 'Point') {
        e.feature.setStyle(pointStyle(this_.options, false, this_.map.getView().getZoom(), true))
        const coordinates = e.feature.getGeometry().getCoordinates()
        const lont = transform(coordinates, 'EPSG:3857', 'EPSG:4326')
        const featureData = { ...this_.options }
        featureData.lng = lont[0]
        featureData.lat = lont[1]
        featureData.id = createFeatureId()
        var format = new WKT()
        featureData.geom = format.writeGeometry(
          e.feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326')
        )
        e.feature.set('data', featureData)
      }
      clickEvent && clickEvent(true)
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

        const featureData = { ...feature.getProperties().data }
        const node1: any = this.handleLine_node(x, y, feature.get('data'), true)
        x = node1.getGeometry().getCoordinates()[0]
        y = node1.getGeometry().getCoordinates()[1]
        featureData.startId = node1.get('data').id
        featureData.startType = TYPENUMS[node1.get('data').featureType]

        let isAdd = false
        if (index === coordinates.length - 2) isAdd = true
        const node2: any = this.handleLine_node(
          nextPonintX,
          nextPonintY,
          feature.get('data'),
          isAdd
        )

        if (node2) {
          nextPonintX = node2.getGeometry().getCoordinates()[0]
          nextPonintY = node2.getGeometry().getCoordinates()[1]
          featureData.endId = node2.get('data').id
          featureData.endType = TYPENUMS[node2.get('data').featureType]
        }

        const lineString = new LineString([
          [x, y],
          [nextPonintX, nextPonintY],
        ])
        const feature_ = new Feature(lineString)

        var format = new WKT()
        featureData.geom = format.writeGeometry(
          lineString.clone().transform('EPSG:3857', 'EPSG:4326')
        )
        featureData.id = createFeatureId()
        feature_.set('data', featureData)
        feature_.setStyle(lineStyle(featureData))
        let datas: any = pre.concat(feature_)
        if (datas.length > 1) {
          datas[datas.length - 2].get('data').endId = datas[datas.length - 1].get('data').startId
          datas[datas.length - 2].get('data').endType = datas[datas.length - 1].get(
            'data'
          ).startType
        }
        return datas
      }, [])

      // 移除原有要素层
      source.removeFeature(feature)
      if (parseInt(feature.get('data').loopNumber) === 1) {
        // 将拆分生成的新要素层添加至图层

        features.forEach((f: any) => {
          var data = f.get('data')
          data = { ...f.get('data'), ...f.get('data').data[0] }
          f.set('data', data)
          f.setStyle(lineStyle(data))
          source.addFeature(f)
        })
      } else {
        const multiloops = calculationLine(features, feature.get('data').loopNumber)
        multiloops.forEach((loopData: any) => {
          const loopGeom: any = new WKT()
            .readGeometry(loopData.geom)
            .transform('EPSG:4326', 'EPSG:3857')
          const loopFeature = new Feature(loopGeom)
          loopData.id = createFeatureId()
          loopFeature.set('data', loopData)
          loopFeature.setStyle(lineStyle(loopData))
          source.addFeature(loopFeature)
        })
      }
    }, 0)
  }

  handleLine_node = (lont: number, lat: number, lineData: any, isAdd: boolean) => {
    let node
    const pixel = this.map.getPixelFromCoordinate([lont, lat])
    this.map.forEachFeatureAtPixel(
      pixel,
      function (feature: any, layer: any) {
        if (layer && layer.get('name') === 'pointLayer') node = feature
      },
      {
        hitTolerance: 10,
      }
    )
    if (!node && isAdd) {
      var data: any
      if (lineData.data.length === 1) {
        // 不是多回路情况
        data = { ...lineData, ...lineData.data[0] }
      } else {
        let lineIds: any = []
        lineData.data.forEach((element: any) => {
          if (lineIds.indexOf(element.lineId) === -1) lineIds.push(element.lineId)
        })
        data = {
          color: lineData.data[0].color,
          kvLevel: lineData.data[0].kvLevel,
          companyId: lineData.companyId,
          name: lineData.name,
          lineId: lineIds.toString(),
          lineType: LINE,
        }
      }
      let pointLayer = getLayer(this.map, 'pointLayer', 3)
      let point = new Point([lont, lat])
      node = new Feature(point)
      const coordinates = point.getCoordinates()
      const lont_ = transform(coordinates, 'EPSG:3857', 'EPSG:4326')
      data.lng = lont_[0]
      data.lat = lont_[1]
      var format = new WKT()
      data.geom = format.writeGeometry(point.clone().transform('EPSG:3857', 'EPSG:4326'))

      if (data.lineType === LINE) {
        data.featureType = TOWER
      } else if (data.lineType === CABLECIRCUIT) {
        data.featureType = CABLEWELL
      }
      node.setStyle(pointStyle(data, false, this.map.getView().getZoom(), true))
      data.id = createFeatureId()
      data.type_ = 'Point'
      node.set('data', data)
      pointLayer.getSource().addFeature(node)
    }
    return node
  }
}

export default DrawTool
