import { getMapRegisterData } from '@/services/index'
import {
  BOXTRANSFORMER,
  CABLEBRANCHBOX,
  CABLECIRCUIT,
  CABLEWELL,
  COLUMNCIRCUITBREAKER,
  COLUMNTRANSFORMER,
  ELECTRICITYDISTRIBUTIONROOM,
  POWERSUPPLY,
  RINGNETWORKCABINET,
  SWITCHINGSTATION,
  TOWER,
  TRANSFORMERSUBSTATION,
} from '../../DrawToolbar/GridUtils'

/** 将手动绘制的点位保存到本地 */
export const storeLocalFeatureData = (featureData: any) => {
  switch (featureData.featureType) {
    case TOWER:
      const towerList = JSON.parse(localStorage.getItem('towerList') || '[]')
      towerList.push({
        geom: featureData.geom,
        kvLevel: featureData.kvLevel,
        lineId: featureData.lineId,
        name: featureData.name,
        seId: featureData.seId,
        id: featureData.id,
      })
      localStorage.setItem('towerList', JSON.stringify(towerList))
      break
    case SWITCHINGSTATION:
      const switchingStationList = JSON.parse(localStorage.getItem('switchingStationList') || '[]')
      switchingStationList.push({
        geom: featureData.geom,
        kvLevel: featureData.kvLevel,
        lineId: featureData.lineId,
        name: featureData.name,
        seId: featureData.seId,
        id: featureData.id,
      })
      localStorage.setItem('switchingStationList', JSON.stringify(switchingStationList))
      break
    case RINGNETWORKCABINET:
      const ringNetworkCabinetList = JSON.parse(
        localStorage.getItem('ringNetworkCabinetList') || '[]'
      )
      ringNetworkCabinetList.push({
        geom: featureData.geom,
        kvLevel: featureData.kvLevel,
        lineId: featureData.lineId,
        name: featureData.name,
        model: featureData.model,
        properties: featureData.properties,
        seId: featureData.seId,
        id: featureData.id,
      })
      localStorage.setItem('ringNetworkCabinetList', JSON.stringify(ringNetworkCabinetList))
      break
    case ELECTRICITYDISTRIBUTIONROOM:
      const electricityDistributionRoomList = JSON.parse(
        localStorage.getItem('electricityDistributionRoomList') || '[]'
      )
      electricityDistributionRoomList.push({
        geom: featureData.geom,
        kvLevel: featureData.kvLevel,
        lineId: featureData.lineId,
        name: featureData.name,
        properties: featureData.properties,
        id: featureData.id,
        capacity: featureData.capacity,
      })
      localStorage.setItem(
        'electricityDistributionRoomList',
        JSON.stringify(electricityDistributionRoomList)
      )
      break
    case COLUMNTRANSFORMER:
      const columnTransformerList = JSON.parse(
        localStorage.getItem('columnTransformerList') || '[]'
      )
      columnTransformerList.push({
        geom: featureData.geom,
        kvLevel: featureData.kvLevel,
        lineId: featureData.lineId,
        name: featureData.name,
        properties: featureData.properties,
        id: featureData.id,
        capacity: featureData.capacity,
      })
      localStorage.setItem('columnTransformerList', JSON.stringify(columnTransformerList))
      break
    case COLUMNCIRCUITBREAKER:
      const columnCircuitBreakerList = JSON.parse(
        localStorage.getItem('columnCircuitBreakerList') || '[]'
      )
      columnCircuitBreakerList.push({
        geom: featureData.geom,
        kvLevel: featureData.kvLevel,
        lineId: featureData.lineId,
        name: featureData.name,
        id: featureData.id,
      })
      localStorage.setItem('columnCircuitBreakerList', JSON.stringify(columnCircuitBreakerList))
      break
    case CABLEWELL:
      const cableWellList = JSON.parse(localStorage.getItem('cableWellList') || '[]')
      cableWellList.push({
        geom: featureData.geom,
        kvLevel: featureData.kvLevel,
        lineId: featureData.lineId,
        name: featureData.name,
        seId: featureData.seId,
        id: featureData.id,
      })
      localStorage.setItem('cableWellList', JSON.stringify(cableWellList))
      break
    case CABLEBRANCHBOX:
      const cableBranchBoxList = JSON.parse(localStorage.getItem('cableBranchBoxList') || '[]')
      cableBranchBoxList.push({
        geom: featureData.geom,
        kvLevel: featureData.kvLevel,
        lineId: featureData.lineId,
        name: featureData.name,
        seId: featureData.seId,
        id: featureData.id,
      })
      localStorage.setItem('cableBranchBoxList', JSON.stringify(cableBranchBoxList))
      break
    case BOXTRANSFORMER:
      const boxTransformerList = JSON.parse(localStorage.getItem('boxTransformerList') || '[]')
      boxTransformerList.push({
        geom: featureData.geom,
        kvLevel: featureData.kvLevel,
        lineId: featureData.lineId,
        name: featureData.name,
        properties: featureData.properties,
        id: featureData.id,
        seId: featureData.seId,
        capacity: featureData.capacity,
      })
      localStorage.setItem('boxTransformerList', JSON.stringify(boxTransformerList))
      break
    case POWERSUPPLY:
      const powerSupplyList = JSON.parse(localStorage.getItem('powerSupplyList') || '[]')
      powerSupplyList.push({
        geom: featureData.geom,
        kvLevel: featureData.kvLevel,
        name: featureData.name,
        id: featureData.id,
        powerType: featureData.powerType,
        schedulingMode: featureData.schedulingMode,
        installedCapacity: featureData.installedCapacity,
      })
      localStorage.setItem('powerSupplyList', JSON.stringify(powerSupplyList))
      break
    case TRANSFORMERSUBSTATION:
      const transformerStationList = JSON.parse(
        localStorage.getItem('transformerStationList') || '[]'
      )
      transformerStationList.push({
        geom: featureData.geom,
        kvLevel: featureData.kvLevel,
        name: featureData.name,
        id: featureData.id,
        designScaleMainTransformer: featureData.designScaleMainTransformer,
        builtScaleMainTransformer: featureData.builtScaleMainTransformer,
      })
      localStorage.setItem('transformerStationList', JSON.stringify(transformerStationList))
      break
    case CABLECIRCUIT:
    // 线路段
    // const lineElementRelationList = JSON.parse(
    //   localStorage.getItem('lineElementRelationList') || '[]'
    // )
    // lineElementRelationList.push({
    //   id: featureData.id,
    //   geom: featureData.geom,
    //   lineModel: featureData.lineModel,
    //   endType: featureData.endType,
    //   startType: featureData.startType,
    //   startId: featureData.startId,
    //   lineId: featureData.lineId,
    //   endId: featureData.endId,
    // })
  }
}

/** 加载行政区域数据 **/
export const getDistrictdata = () => {
  let loadPromiseAll: any[] = []
  const district = [
    '650000',
    // '540000',
    // '150000',
    '510000',
    // '530000',
    '620000',
    // '630000',
    // '640000',
    '620300',
    '620600',
    '620700',
    '620900',
    '100000',
  ]
  district.forEach((item: string) => {
    loadPromiseAll.push(getMapRegisterData(item))
  })
  return Promise.all(loadPromiseAll)
}
