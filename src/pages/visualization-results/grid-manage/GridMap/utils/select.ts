import WKT from 'ol/format/WKT'
import LineString from 'ol/geom/LineString'
import Point from 'ol/geom/Point'
import { Select, Translate } from 'ol/interaction'
import { pointType } from '..'
import { getLayer } from './loadLayer'
import { lineStyle, pointStyle } from './style'

var select: any
var translate: any
var currrentSelectFeature: any
var deleFeatures: any = []
export const initSelect = (map: any, isActiveFeature: (data: pointType | null) => void) => {
  let pointLayer = getLayer(map, 'pointLayer', 3)
  let lineLayer = getLayer(map, 'lineLayer', 2)
  let layers = [pointLayer, lineLayer]
  select = new Select({
    layers,
    style: function (feature: any) {
      let geomType = feature.getGeometry().getType()
      if (geomType === 'LineString') {
        return lineStyle(feature.get('data'), true)
      }
      return pointStyle(feature.get('data'), true, map.getView().getZoom())
    },
    hitTolerance: 10,
  })
  map.addInteraction(select)

  select.on('select', (evt: any) => {
    if (evt.selected.length > 0) {
      translate.setActive(true)
      currrentSelectFeature = evt.selected[0]
      /* 弹出属性显示框 **/
      isActiveFeature(currrentSelectFeature.get('data'))
      if (currrentSelectFeature.getGeometry().getType() === 'Point') {
        const isDraw = currrentSelectFeature.get('data').type_ ? true : false
        currrentSelectFeature.setStyle(
          pointStyle(currrentSelectFeature.get('data'), true, map.getView().getZoom(), isDraw)
        )
      } else {
        currrentSelectFeature.setStyle(lineStyle(currrentSelectFeature.get('data'), true))
        translate.setActive(false)
      }
    } else {
      if (currrentSelectFeature) {
        if (currrentSelectFeature.getGeometry().getType() === 'Point') {
          const isDraw = currrentSelectFeature.get('data').type_ ? true : false
          currrentSelectFeature.setStyle(
            pointStyle(currrentSelectFeature.get('data'), false, map.getView().getZoom(), isDraw)
          )
        } else {
          currrentSelectFeature.setStyle(lineStyle(currrentSelectFeature.get('data'), false))
        }
      }
      currrentSelectFeature = null
      isActiveFeature(null)
    }
  })
  initTranslate(map)
}

export const initTranslate = (map: any) => {
  if (translate) map.removeInteraction(translate)
  translate = new Translate({
    features: select.getFeatures(),
    hitTolerance: 10,
  })
  map.addInteraction(translate)

  // translate.on('translatestart', (evt:any) => {
  // })

  translate.on('translating', (evt: any) => {
    const feature = evt.features.getArray()[0]
    updateLine(map, feature)
  })

  translate.on('translateend', (evt: any) => {
    const feature = evt.features.getArray()[0]
    updateLine(map, feature)

    const point = feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326')
    const format = new WKT()
    feature.get('data').geom = format.writeGeometry(point)
    feature.get('data').lng = point.getCoordinates()[0]
    feature.get('data').lat = point.getCoordinates()[1]
  })
}

const updateLine = (map: any, feature: any) => {
  const featureCoords = feature.getGeometry().getCoordinates()
  const lineLayer = getLayer(map, 'lineLayer')
  const data = feature.get('data')
  const features = lineLayer
    .getSource()
    .getFeatures()
    .filter(
      (item: any) => item.get('data').endId === data.id || item.get('data').startId === data.id
    )

  features.forEach((f: any) => {
    const lineCoords = f.getGeometry().getCoordinates()
    let lineGeom
    if (f.get('data').endId === data.id) {
      lineGeom = new LineString([lineCoords[0], featureCoords])
    } else {
      lineGeom = new LineString([featureCoords, lineCoords[1]])
    }
    const format = new WKT()
    f.get('data').geom = format.writeGeometry(lineGeom.clone().transform('EPSG:3857', 'EPSG:4326'))
    f.setGeometry(lineGeom)
  })
}

export const setSelectActive = (active: boolean) => {
  select && select.setActive(active)
}

export const getCurrrentSelectFeature = () => {
  return currrentSelectFeature
}

export const getDeleFeatures = () => {
  return deleFeatures
}

export const deletCurrrentSelectFeature = (map: any) => {
  deleFeatures = []
  if (!currrentSelectFeature) return
  let geomType = currrentSelectFeature.getGeometry().getType()
  let pointLayer = getLayer(map, 'pointLayer'),
    lineLayer = getLayer(map, 'lineLayer')
  if (geomType === 'LineString') {
    lineLayer.getSource().removeFeature(currrentSelectFeature)
    deleFeatures.push(currrentSelectFeature.get('data'))
    //! 删除线路 ....currrentSelectFeature.get('data')

    currrentSelectFeature = null
  } else if (geomType === 'Point') {
    pointLayer.getSource().removeFeature(currrentSelectFeature)
    deleFeatures.push(currrentSelectFeature.get('data'))
    // !!  1. 删除点位 首先要删除当前点位 currrentSelectFeature.get('data')
    const pointId = currrentSelectFeature.get('data').id
    const lines = lineLayer.getSource().getFeatures()

    if (Object.prototype.toString.call(lines) === '[object Array]' && lines.length) {
      lines.forEach((item: any) => {
        if (item.get('data').startId === pointId || item.get('data').endId === pointId) {
          // !  2... 然后删除线路  item.get('data')
          lineLayer.getSource().removeFeature(item)
          deleFeatures.push(item.get('data'))
        }
      })
    }
  }

  currrentSelectFeature = null
}

export const editFeature = (map: any, data: any) => {
  if (!currrentSelectFeature) return

  if (data.lng && data.lat) {
    const point = new Point([parseFloat(data.lng), parseFloat(data.lat)]).transform(
      'EPSG:4326',
      'EPSG:3857'
    )
    currrentSelectFeature.setGeometry(point)
    var format = new WKT()
    data.type_ = currrentSelectFeature.get('data').type_
    data.geom = format.writeGeometry(point.clone().transform('EPSG:3857', 'EPSG:4326'))
    let isDraw = data.type_ ? true : false
    currrentSelectFeature.setStyle(pointStyle(data, true, map.getView().getZoom(), isDraw))
  }
  currrentSelectFeature.set('data', data)

  // currrentSelectFeature.setStyle(pointStyle(data, true, map.getView().getZoom()))
}

export const getSelectFeatures = () => {
  return select.getFeatures()
}
