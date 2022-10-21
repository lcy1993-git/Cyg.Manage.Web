import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

interface CableWellParams {
  libId: string
  cableWellId: string
  cableWellName: string
  shortName: string
  typicalCode: string
  type: string
  unit: string
  width: number
  depth: number
  isConfined: number
  isSwitchingPipe: number
  feature: string
  pavement: string
  size: string
  coverMode: string
  grooveStructure: string
  forProject: string
  forDesign: string
  remark: string
  chartIds: string[]
}

interface ItemDetailData extends CableWellParams {
  //电缆井id
  id: string
}

//获取单条电缆通道数据
export const getCableWellDetail = (libId: string, id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.resource}/CableWell/GetById`, { method: 'GET', params: { libId, id } })
  )
}

//新增电缆通道
export const addCableWellItem = (params: CableWellParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/CableWell/SaveCreate`, { method: 'POST', data: params })
  )
}

//编辑组件
export const updateCableWellItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/CableWell/SaveModify`, { method: 'POST', data: params })
  )
}

// 删除电缆通道
export const deleteCableWellItem = (params: object) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/CableWell/Delete`, { method: 'POST', data: params })
  )
}

/**电缆井明细操作 */

interface CableWellDetailParams {
  id: string
  componentId: string
  materialId: string
  cableWellId: string
  cableWellName: string
  itemId: string
  itemName: string
  itemNumber: number
  isComponent: number
  spec: string
  unit: string
  itemType: string
}

//获取单条明细数据
export const getCableWellDetailItem = (libId: string, id: string) => {
  return cyRequest<CableWellDetailParams>(() =>
    request(`${baseUrl.resource}/CableWellDetails/GetById`, {
      method: 'GET',
      params: { libId, id },
    })
  )
}

//新增电缆井明细
export const addCableWellDetailItem = (params: CableWellDetailParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/CableWellDetails/SaveCreate`, { method: 'POST', data: params })
  )
}

//编辑明细
export const updateCableWellDetailItem = (params: CableWellDetailParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/CableWellDetails/SaveModify`, { method: 'POST', data: params })
  )
}

// 删除明细
export const deleteCableWellDetailItem = (libId: string, id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/CableWellDetails/Delete`, {
      method: 'POST',
      params: { libId, id },
    })
  )
}

// 获取明细列表
interface ComponentDetaiListlParams {
  items: any[]
}
//获取明细数据列表
export const getCableWelDetaiList = (libId: string, cableWellIds: string[], keyWord: string) => {
  return cyRequest<ComponentDetaiListlParams>(() =>
    request(`${baseUrl.resource}/CableWellDetails/GetPageList`, {
      method: 'POST',
      data: { libId, cableWellIds, keyWord, pageSize: 200, pageIndex: 1 },
    })
  )
}
interface ItemType {
  itemId: string
  itemType: string
  itemNumber: number
}
//更新明细数据列表
export const updateCableWellDetaiList = (libId: string, cableWellId: string, items: ItemType[]) => {
  return cyRequest<ComponentDetaiListlParams>(() =>
    request(`${baseUrl.resource}/CableWellDetails/SaveBatchCreate`, {
      method: 'POST',
      data: { libId, cableWellId, items },
    })
  )
}
