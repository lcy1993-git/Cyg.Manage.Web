import { Select } from 'ol/interaction'
import { getLayer } from './loadLayer'
import { lineStyle, pointStyle } from './style'

var select: any
var currrentSelectFeature: any
export const initSelect = (map: any) => {
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
      return pointStyle(feature.get('data'), true)
    },
    hitTolerance: 10,
  })
  map.addInteraction(select)

  select.on('select', (evt: any) => {
    if (evt.selected.length > 0) {
      currrentSelectFeature = evt.selected[0]
    } else {
      currrentSelectFeature = null
    }
  })
  return select
}

export const setSelectActive = (active: boolean) => {
  select && select.setActive(active)
}

export const deletCurrrentSelectFeature = (map: any) => {
  if (!currrentSelectFeature) return
  let geomType = currrentSelectFeature.getGeometry().getType()
  let pointLayer = getLayer(map, 'pointLayer'),
    lineLayer = getLayer(map, 'lineLayer')
  if (geomType === 'LineString') {
    lineLayer.getSource().removeFeature(currrentSelectFeature)
    currrentSelectFeature = null
  } else if (geomType === 'Point') {
    pointLayer.getSource().removeFeature(currrentSelectFeature)
    const pointId = currrentSelectFeature.get('data').seId
    const startLine = lineLayer
      .getSource()
      .getFeatures()
      .find((item: any) => item.get('data').startId === pointId)
    startLine && lineLayer.getSource().removeFeature(startLine)
    const endLine = lineLayer
      .getSource()
      .getFeatures()
      .find((item: any) => item.get('data').endId === pointId)
    endLine && lineLayer.getSource().removeFeature(endLine)
    currrentSelectFeature = null
  }
}
