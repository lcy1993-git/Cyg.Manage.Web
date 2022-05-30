import { Select } from 'ol/interaction'
import { getLayer } from './loadLayer'
import { lineStyle, pointStyle } from './style'
interface pointType {
  featureType: string
  name?: string
  kvLevel?: string
  designScaleMainTransformer?: string
  builtScaleMainTransformer?: string
  mainWiringMode?: string
  powerType?: string
  installedCapacity?: string
  schedulingMode?: string
  lineId?: string
  capacity?: string
  model?: string
  properties?: string
  lng?: string
  geom: string
  id: string
}
var select: any
var currrentSelectFeature: any
var deleFeatures: any = []
export const initSelect = (map: any, isActiveFeature: (data: pointType) => void) => {
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
      /* 弹出属性显示框 **/
      // console.log(currrentSelectFeature.get('data'), '当前要素')
      isActiveFeature(currrentSelectFeature.get('data'))
    } else {
      currrentSelectFeature = null
    }
  })
  return select
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
    lineLayer
      .getSource()
      .getFeatures()
      .forEach((item: any) => {
        if (item.get('data').startId === pointId || item.get('data').endId === pointId) {
          // !  2... 然后删除线路  item.get('data')
          lineLayer.getSource().removeFeature(item)
          deleFeatures.push(item.get('data'))
        }
      })
  }

  currrentSelectFeature = null
}
