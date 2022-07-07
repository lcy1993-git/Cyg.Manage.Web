import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

const GridManageRequest = (url: string, options?: Parameters<typeof request>[1]) => {
  const _url = `${baseUrl.grid}/${url.startsWith('/') ? url.slice(1) : url}`
  return request(_url, options)
}

/** 导入网架数据 */
export const importGridManageData = (data: FormData) => {
  return GridManageRequest('/Import/All', {
    method: 'POST',
    data,
    requestType: 'form',
  })
}

/** 下载网架数据模板 */
export const downloadExcelTemplate = () => {
  return GridManageRequest('/Import/Template', { responseType: 'blob' })
}

/** 获取变电站下面的网架数据 **/
export const featchSubstationTreeData = (params: { lineIds: string[]; kvLevels: string[] }) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/Line/GetLineCompoment`, { method: 'POST', data: params })
  )
}
/** 获取变电站下面的网架数据 **/
export const getIntervalByTransformer = (params: { transformerId: string }) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/TransformerSubstation/GetIntervalByTransformer`, {
      method: 'GET',
      params,
    })
  )
}

/** 获取所有变电站 **/
export const getSubStations = (params: { powerIds: string[]; stationIds: string[] }) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/GridDesign/GetSubStations`, {
      method: 'POST',
      data: params,
    })
  )
}

export const featchPowerSupplyTreeData = (params: { ids: string[] }) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/Line/GetLinesByPower`, { method: 'POST', data: params })
  )
}

export const fetchGridManageMenu = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/PowerSupply/Tree`, { method: 'POST', data: params })
  )
}

//变电站树
export const getTransformerSubstationMenu = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/TransformerSubstation/Tree`, { method: 'POST', data: params })
  )
}

// 获取所属线路
export const getAllBelongingLineItem = () => {
  return cyRequest<any[]>(() => request(`${baseUrl.grid}/Line/GetLineItems`, { method: 'GET' }))
}
// 获取所有厂站
export const GetStationItems = () => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/GridDesign/GetStationItems`, { method: 'GET' })
  )
}

// 创建线路
export const createLine = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/Line/Create`, { method: 'POST', data: params })
  )
}

// 上传所有点位
export const uploadAllFeature = (params: any) => {
  return cyRequest(() =>
    request(`${baseUrl.grid}/GridDesign/SaveGridDesign`, {
      method: 'POST',
      data: params,
    })
  )
}

/** 根据ID获取线路信息 **/
export const getLineData = (id: string | undefined) => {
  return cyRequest(() => request(`${baseUrl.grid}/Line/GetById`, { method: 'GET', params: { id } }))
}

/** 创建变电站 */
// export const createTransformerSubstation = (params: TransformerSubstationType) => {
//   return cyRequest<any[]>(() =>
//     request(`${baseUrl.grid}/TransformerSubstation/Create`, { method: 'POST', data: params })
//   )
// }
/** 创建电源 */
// export const createPowerSupply = (params: PowerSupplyType) => {
//   return cyRequest<any[]>(() =>
//     request(`${baseUrl.grid}/PowerSupply/Create`, { method: 'POST', data: params })
//   )
// }

/** 创建杆塔 **/
// export const createTower = (params: any) => {
//   return cyRequest<any[]>(() =>
//     request(`${baseUrl.grid}/Tower/Create`, { method: 'POST', data: params })
//   )
// }

/** 更新杆塔信息 **/
export const modifyTower = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/Tower/Modify`, { method: 'POST', data: params })
  )
}
/** 更新箱变信息 **/
export const modifyBoxTransformer = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/CableBranchBox/Modify`, { method: 'POST', data: params })
  )
}
/** 更新电缆井信息 **/
export const modifyCableWell = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/CableWell/Modify`, { method: 'POST', data: params })
  )
}
/** 更新柱上断路器信息 **/
export const modifyColumnCircuitBreaker = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/ColumnCircuitBreaker/Modify`, { method: 'POST', data: params })
  )
}
/** 更新柱上变压器信息 **/
export const modifyColumnTransformer = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/ColumnTransformer/Modify`, { method: 'POST', data: params })
  )
}
/** 更新配电室信息 **/
export const modifyElectricityDistributionRoom = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/ElectricityDistributionRoom/Modify`, { method: 'POST', data: params })
  )
}
/** 更新电源信息 **/
export const modifyPowerSupply = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/PowerSupply/Modify`, { method: 'POST', data: params })
  )
}
/** 更新环网柜信息 **/
export const modifyRingNetworkCabinet = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/RingNetworkCabinet/Modify`, { method: 'POST', data: params })
  )
}
/** 更新开闭所信息 **/
export const modifySwitchingStation = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/SwitchingStation/Modify`, { method: 'POST', data: params })
  )
}
/** 更新变电站信息 **/
export const modifyTransformerSubstation = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/TransformerSubstation/Modify`, { method: 'POST', data: params })
  )
}
/** 更新变电站信息 **/
export const modifyCableBranchBox = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/CableBranchBox/Modify`, { method: 'POST', data: params })
  )
}
/** 更新主线路信息 **/
export const modifyLine = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/Line/Modify`, { method: 'POST', data: params })
  )
}
/** 更新线路端信息 **/
export const modifyRelationLine = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/LineElementRelation/ModifyLineElementRelation`, {
      method: 'POST',
      data: params,
    })
  )
}

/** 更新线路信息 **/
export const getLineCompoment = (params: string[]) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/Line/GetLineCompoment`, { method: 'POST', data: params })
  )
}

/** //!! 删除杆塔信息 **/
export const deleteTower = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/Tower/DeleteById`, { method: 'POST', data: params })
  )
}
/** 删除箱变信息 **/
export const deleteBoxTransformer = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/BoxTransformer/DeleteById`, { method: 'POST', data: params })
  )
}
/** 删除电缆井信息 **/
export const deleteCableWell = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/CableWell/DeleteById`, { method: 'POST', data: params })
  )
}
/** 删除柱上断路器信息 **/
export const deleteColumnCircuitBreaker = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/ColumnCircuitBreaker/DeleteById`, { method: 'POST', data: params })
  )
}
/** 删除柱上变压器信息 **/
export const deleteColumnTransformer = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/ColumnTransformer/DeleteById`, { method: 'POST', data: params })
  )
}
/** 删除配电室信息 **/
export const deleteElectricityDistributionRoom = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/ElectricityDistributionRoom/DeleteById`, {
      method: 'POST',
      data: params,
    })
  )
}
/** 删除电源信息 **/
export const deletePowerSupply = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/PowerSupply/DeleteById`, { method: 'POST', data: params })
  )
}
/** 删除环网柜信息 **/
export const deleteRingNetworkCabinet = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/RingNetworkCabinet/DeleteById`, { method: 'POST', data: params })
  )
}
/** 删除开闭所信息 **/
export const deleteSwitchingStation = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/SwitchingStation/DeleteById`, { method: 'POST', data: params })
  )
}
/** 删除变电站信息 **/
export const deleteTransformerSubstation = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/TransformerSubstation/DeleteById`, { method: 'POST', data: params })
  )
}
/** 删除电缆分支箱信息 **/
export const deleteCableBranchBox = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/CableBranchBox/DeleteById`, { method: 'POST', data: params })
  )
}
/** 删除线路段信息 **/
export const deleteLineRelations = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/LineElementRelation/DeleteLineRelationsById`, {
      method: 'POST',
      data: params,
    })
  )
}
/** 删除线路信息 **/
export const deleteLine = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/Line/DeleteById`, { method: 'POST', data: params })
  )
}

/** 获取重复点位信息 **/
export const getrepeatPointdata = (params: { lineIds: string[] }) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/GridDesign/CheckRepeatGeom`, { method: 'POST', data: params })
  )
}
