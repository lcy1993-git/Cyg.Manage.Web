import {
  modifyBoxTransformer,
  modifyCableBranchBox,
  modifyCableWell,
  modifyColumnCircuitBreaker,
  modifyColumnTransformer,
  modifyElectricityDistributionRoom,
  modifyPowerSupply,
  modifyRelationLine,
  modifyRingNetworkCabinet,
  modifySwitchingStation,
  modifyTower,
  modifyTransformerSubstation,
} from '@/services/grid-manage/treeMenu'
import { message } from 'antd'
import WKT from 'ol/format/WKT'
import LineString from 'ol/geom/LineString'
import Point from 'ol/geom/Point'
import { Select, Translate } from 'ol/interaction'
import { pointType } from '..'
import {
  BOXTRANSFORMER,
  CABLEBRANCHBOX,
  CABLEWELL,
  COLORDEFAULT,
  COLORU,
  COLUMNCIRCUITBREAKER,
  COLUMNTRANSFORMER,
  ELECTRICITYDISTRIBUTIONROOM,
  POINTS,
  POWERSUPPLY,
  RINGNETWORKCABINET,
  SWITCHINGSTATION,
  TOWER,
  TRANSFORMERSUBSTATION,
} from '../../DrawToolbar/GridUtils'
import { clearBoxData } from './initializeMap'
import { getLayer } from './loadLayer'
import { calculationLineByPoints } from './multiloop'
import { lineStyle, pointStyle } from './style'

var select: any
var translate: any
var currrentSelectFeature: any
var deleFeatures: any = []
//@ts-ignore
var { companyId } = JSON.parse(localStorage.getItem('userInfo'))
export const initSelect = (
  map: any,
  isActiveFeature: (data: pointType | null) => void,
  isDragPointend: (isDrag: boolean) => void
) => {
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
      clearBoxData()
    }
  })
  initTranslate(map, isDragPointend)
}

export const initTranslate = (map: any, isDragPointend: (isDrag: boolean) => void) => {
  if (translate) map.removeInteraction(translate)
  translate = new Translate({
    features: select.getFeatures(),
    hitTolerance: 10,
  })
  map.addInteraction(translate)

  // translate.on('translatestart', (evt:any) => {
  // })

  translate.on('translating', async (evt: any) => {
    const feature = evt.features.getArray()[0]
    await updateLine(map, feature, false, isDragPointend)
  })

  translate.on('translateend', async (evt: any) => {
    const feature = evt.features.getArray()[0]

    const point = feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326')
    const format = new WKT()
    feature.get('data').geom = format.writeGeometry(point)
    feature.get('data').lng = point.getCoordinates()[0]
    feature.get('data').lat = point.getCoordinates()[1]

    await updateLine(map, feature, true, isDragPointend)
  })
}

const updateLine = async (
  map: any,
  feature: any,
  isEnd: boolean,
  isDragPointend: (isDrag: boolean) => void
) => {
  const featureCoords = feature.getGeometry().getCoordinates()
  const pointLayer = getLayer(map, 'pointLayer')
  const lineLayer = getLayer(map, 'lineLayer')
  const data = feature.get('data')
  const features = lineLayer
    .getSource()
    .getFeatures()
    .filter(
      (item: any) => item.get('data').endId === data.id || item.get('data').startId === data.id
    )

  // 非回路线路
  const singleFeatures = features.filter(
    (item: any) => !item.get('data').loopNumber || item.get('data').loopNumber === 1
  )
  singleFeatures.forEach((f: any) => {
    const lineCoords = f.getGeometry().getCoordinates()
    let lineGeom
    if (f.get('data').endId === data.id) {
      lineGeom = new LineString([lineCoords[0], featureCoords])
    } else {
      lineGeom = new LineString([featureCoords, lineCoords[1]])
    }
    f.setGeometry(lineGeom)
    if (isEnd) {
      const format = new WKT()
      f.get('data').geom = format.writeGeometry(
        lineGeom.clone().transform('EPSG:3857', 'EPSG:4326')
      )
    }
  })

  // 多回路线路
  const multiFeatures = features.filter(
    (item: any) => item.get('data').loopNumber && item.get('data').loopNumber > 1
  )
  var multiDatas: any = []
  multiFeatures.forEach((line: any) => {
    const startId = line.get('data').startId
    const endId = line.get('data').endId

    const startPoint = pointLayer
      .getSource()
      .getFeatures()
      .find((item: any) => item.get('data').id === startId)
    const endPoint = pointLayer
      .getSource()
      .getFeatures()
      .find((item: any) => item.get('data').id === endId)

    const startCoord =
      startId === data.id ? featureCoords : startPoint.getGeometry().getCoordinates()
    const endCoord = endId === data.id ? featureCoords : endPoint.getGeometry().getCoordinates()
    const loopNumber = line.get('data').loopNumber

    // 判断是否为起始点
    let isStart = lineLayer
      .getSource()
      .getFeatures()
      .find((item: any) => item.get('data').endId === line.get('data').startId)
    isStart = isStart ? false : true

    // 判断是否为结束点
    let isEnd = lineLayer
      .getSource()
      .getFeatures()
      .find((item: any) => item.get('data').startId === line.get('data').endId)
    isEnd = isEnd ? false : true
    const multiData = {
      startId,
      endId,
      startCoord,
      endCoord,
      loopNumber,
      isStart,
      isEnd,
    }
    // 判断是否存在
    let isExist
    multiDatas.forEach((item: any) => {
      if (item.startId === startId && item.endId === endId) isExist = true
    })
    !isExist && multiDatas.push(multiData)
  })

  multiDatas.forEach((multiData: any) => {
    const startCoord = { x: multiData.startCoord[0], y: multiData.startCoord[1] }
    const endCoord = { x: multiData.endCoord[0], y: multiData.endCoord[1] }
    const loopNumber = multiData.loopNumber
    const isStart = multiData.isStart
    const isEnd = multiData.isEnd
    const datas = calculationLineByPoints(startCoord, endCoord, loopNumber, isStart, isEnd)

    datas.forEach((data: any) => {
      const multiFeature = multiFeatures.find(
        (item: any) =>
          item.get('data').startId === multiData.startId &&
          item.get('data').endId === multiData.endId &&
          item.get('data').loopSerial === data.loopSerial
      )
      // const geom = new WKT().readGeometry(data.wkt).transform('EPSG:4326', 'EPSG:3857')
      const geom = new WKT().readGeometry(data.wkt)
      multiFeature.setGeometry(geom)
      multiFeature.get('data').geom = new WKT().writeGeometry(
        geom.clone().transform('EPSG:3857', 'EPSG:4326')
      )
    })
  })

  if (isEnd) {
    const point = feature.values_.data
    const updateFeatures = singleFeatures.length > 0 ? singleFeatures : multiFeatures
    const lines = updateFeatures.map((item: { values_: { data: any } }) => item.values_.data)
    isDragPointend(true)
    await upLoadPoint(point, lines, isDragPointend)
  }
}

// 点位数据上传
export const upLoadPoint = async (
  data: { featureType: string; color: string; companyId: string; id: string },
  lines: any[],
  isDragPointend?: (isDrag: boolean) => void
) => {
  if (companyId !== data.companyId) {
    return
  }
  try {
    const PromiseAll = []
    let currentColor = ''
    const color = COLORU.find((item) => item.value === data.color)
    currentColor = color ? color.label : COLORDEFAULT
    switch (data.featureType) {
      case TOWER:
        await PromiseAll.push(modifyTower({ ...data, color: currentColor }))
        break
      case BOXTRANSFORMER:
        await PromiseAll.push(modifyBoxTransformer({ ...data, color: currentColor }))
        break
      case POWERSUPPLY:
        await PromiseAll.push(modifyPowerSupply({ ...data, color: currentColor }))
        break
      case TRANSFORMERSUBSTATION:
        await PromiseAll.push(modifyTransformerSubstation({ ...data, color: currentColor }))
        break
      case CABLEWELL:
        await PromiseAll.push(modifyCableWell({ ...data, color: currentColor }))
        break
      case RINGNETWORKCABINET:
        await PromiseAll.push(modifyRingNetworkCabinet({ ...data, color: currentColor }))
        break
      case ELECTRICITYDISTRIBUTIONROOM:
        await PromiseAll.push(modifyElectricityDistributionRoom({ ...data, color: currentColor }))
        break
      case SWITCHINGSTATION:
        await PromiseAll.push(modifySwitchingStation({ ...data, color: currentColor }))
        break
      case COLUMNCIRCUITBREAKER:
        await PromiseAll.push(modifyColumnCircuitBreaker({ ...data, color: currentColor }))
        break
      case COLUMNTRANSFORMER:
        await PromiseAll.push(modifyColumnTransformer({ ...data, color: currentColor }))
        break
      case CABLEBRANCHBOX:
        await PromiseAll.push(modifyCableBranchBox({ ...data, color: currentColor }))
        break
    }
    lines.forEach((item) => {
      let lineColor = ''
      const color = COLORU.find((color) => color.value === item.color)
      lineColor = color ? color.label : COLORDEFAULT
      PromiseAll.push(modifyRelationLine({ ...item, color: lineColor }))
    })
    Promise.all(PromiseAll)
      .then(() => {
        localStorage.setItem('dragPointId', data.id)
        isDragPointend && isDragPointend(false)
      })
      .catch((err) => {
        // console.log(err, '信息修改失败')
      })
  } catch (err) {}
}

export const setSelectActive = (active: boolean) => {
  select && select.setActive(active)
}

export const getCurrrentSelectFeature = () => {
  return currrentSelectFeature
}

export const setDeleFeatures = (data: any) => {
  deleFeatures = data
}

export const getDeleFeatures = () => {
  return deleFeatures
}

export const deletCurrrentSelectFeature = (map: any) => {
  deleFeatures = []

  if (currrentSelectFeature && currrentSelectFeature.get('data').companyId !== companyId) {
    message.error('无法删除子公司元素')
    return
  }
  currrentSelectFeature && deleFeature(map, currrentSelectFeature)
  currrentSelectFeature = null
}

// 通过台账删除要素
export const deletFeatureByTable = (map: any, data: any, lineIds?: String[]) => {
  if (!data) {
    if (lineIds && lineIds.length) {
      deleFeatureBylinesId(map, lineIds)
    }
    return
  }
  const pointLayer = getLayer(map, 'pointLayer')
  let lineLayer = getLayer(map, 'lineLayer')

  if (POINTS.indexOf(data.featureType) > -1) {
    // 属于点要素
    if (data.featureType === POWERSUPPLY || data.featureType === TRANSFORMERSUBSTATION) {
      lineIds && deleFeatureBylinesId(map, lineIds)
    }
    const point = pointLayer
      .getSource()
      .getFeatures()
      .find((point: any) => point.get('data').id === data.id)
    if (point) {
      pointLayer.getSource().removeFeature(point)
    }
  } else {
    // 属于线要素
    lineLayer
      .getSource()
      .getFeatures()
      .forEach((line: any) => {
        if ((line.get('data').id = data.id)) lineLayer.getSource().removeFeature(line)
      })
  }
}

export const deleFeature = (map: any, feature: any, lineIds?: String[]) => {
  if (!feature) return
  let geomType = feature.getGeometry().getType()
  const pointLayer = getLayer(map, 'pointLayer')
  const lineLayer = getLayer(map, 'lineLayer')
  if (geomType === 'LineString') {
    lineLayer.getSource().removeFeature(feature)
    deleFeatures.push(feature.get('data'))
    //! 删除线路 ....currrentSelectFeature.get('data')
  } else if (geomType === 'Point') {
    if (
      feature.get('data').featureType !== POWERSUPPLY &&
      feature.get('data').featureType !== TRANSFORMERSUBSTATION
    ) {
      deleAllChildFeature(map, feature)
    } else {
      // const lineIds: String[] = [] // 获取线路id
      // deleFeatureBylinesId(map, lineIds, true)
      deleFeatures.push(feature.get('data'))
      pointLayer.getSource().removeFeature(feature)
    }
  }
}

const deleAllChildFeature = (map: any, feature: any, isDeleAll: boolean = false) => {
  const pointLayer = getLayer(map, 'pointLayer')
  const lineLayer = getLayer(map, 'lineLayer')

  pointLayer.getSource().removeFeature(feature)
  deleFeatures.push(feature.get('data'))

  const lines = lineLayer.getSource().getFeatures()
  const pointId = feature.get('data').id
  if (Object.prototype.toString.call(lines) === '[object Array]' && lines.length) {
    lines.forEach((item: any) => {
      if (item.get('data').startId === pointId || item.get('data').endId === pointId) {
        // !  2... 然后删除线路  item.get('data')
        lineLayer.getSource().removeFeature(item)
        deleFeatures.push(item.get('data'))
        if (isDeleAll) {
          if (item.get('data').startId === pointId) {
            const childFeature = pointLayer
              .getSource()
              .getFeatures()
              .find((point: any) => point.get('data').id === item.get('data').endId)
            childFeature && deleAllChildFeature(map, childFeature, isDeleAll)
          }
        }
      }
    })
  }
}

// 通过lineid删除相关地图要素
const deleFeatureBylinesId = (map: any, lineIds: String[], isMap: boolean = false) => {
  const pointLayer = getLayer(map, 'pointLayer')
  const lineLayer = getLayer(map, 'lineLayer')

  if (lineIds && lineIds.length > 0) {
    lineIds.forEach((lineId: String) => {
      const points = pointLayer
        .getSource()
        .getFeatures()
        .filter((point: any) => point.get('data').lineId === lineId)
      const lines = lineLayer
        .getSource()
        .getFeatures()
        .filter((line: any) => line.get('data').lineId === lineId)
      if (points && points.length > 0) {
        points.forEach((point: any) => {
          isMap && deleFeatures.push(point.get('data'))
          pointLayer.getSource().removeFeature(point)
        })
      }
      if (lines && lines.length > 0) {
        lines.forEach((line: any) => {
          isMap && deleFeatures.push(line.get('data'))
          lineLayer.getSource().removeFeature(line)
        })
      }
    })
  }
}

export const editFeature = (map: any, data: any) => {
  let currrent
  if (currrentSelectFeature) {
    currrent = currrentSelectFeature
  } else {
    let feature, layer
    if (POINTS.indexOf(data.featureType) > -1) {
      // 点要素
      layer = getLayer(map, 'pointLayer')
    } else {
      layer = getLayer(map, 'lineLayer')
    }
    feature = layer
      .getSource()
      .getFeatures()
      .find((item: any) => item.get('data').id === data.id)

    if (feature) currrent = feature
    else return
  }
  if (data.lng && data.lat) {
    const point = new Point([parseFloat(data.lng), parseFloat(data.lat)]).transform(
      'EPSG:4326',
      'EPSG:3857'
    )
    currrent.setGeometry(point)
    var format = new WKT()
    // data.type_ = currrent.get('data').type_
    data.geom = format.writeGeometry(point.clone().transform('EPSG:3857', 'EPSG:4326'))
  }

  for (var prop in data) {
    currrent.get('data')[prop] = data[prop]
  }
  // currrent.set('data', data)
  let isDraw = currrent.get('data').type_ ? true : false
  const isSelect = currrentSelectFeature ? true : false
  if (POINTS.indexOf(data.featureType) > -1) {
    // 点要素
    currrent.setStyle(pointStyle(currrent.get('data'), isSelect, map.getView().getZoom(), isDraw))
  } else {
    currrent.setStyle(lineStyle(currrent.get('data'), isSelect))
  }
}
// export const editFeature = (map: any, data: any) => {
//   if (!currrentSelectFeature) return

//   if (data.lng && data.lat) {
//     const point = new Point([parseFloat(data.lng), parseFloat(data.lat)]).transform(
//       'EPSG:4326',
//       'EPSG:3857'
//     )
//     currrentSelectFeature.setGeometry(point)
//     var format = new WKT()
//     data.type_ = currrentSelectFeature.get('data').type_
//     data.geom = format.writeGeometry(point.clone().transform('EPSG:3857', 'EPSG:4326'))
//     let isDraw = data.type_ ? true : false
//     currrentSelectFeature.setStyle(pointStyle(data, true, map.getView().getZoom(), isDraw))
//   }
//   currrentSelectFeature.set('data', data)

//   // currrentSelectFeature.setStyle(pointStyle(data, true, map.getView().getZoom()))
// }

export const getSelectFeatures = () => {
  return select.getFeatures()
}
