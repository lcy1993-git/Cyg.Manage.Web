import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

interface CableChannelParams {
  libId: string
  channelId: string
  channelName: string
  shortName: string
  typicalCode: string
  channelCode: string
  unit: string
  reservedWidth: number
  digDepth: number
  layingMode: string
  cableNumber: number
  pavement: string
  protectionMode: string
  ductMaterialId: string
  arrangement: string
  bracketNumber: number
  forProject: string
  forDesign: string
  remark: string
  chartIds: string[]
}

interface ItemDetailData extends CableChannelParams {
  //组件id
  id: string
}

//获取单条电缆通道数据
export const getCableChannelDetail = (libId: string, id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.resource}/CableChannel/GetById`, { method: 'GET', params: { libId, id } })
  )
}

//新增电缆通道
export const addCableChannelItem = (params: CableChannelParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/CableChannel/SaveCreate`, { method: 'POST', data: params })
  )
}

//编辑组件
export const updateCableChannelItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/CableChannel/SaveModify`, { method: 'POST', data: params })
  )
}

// 删除电缆通道
export const deleteCableChannelItem = (params: object) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/CableChannel/Delete`, { method: 'POST', data: params })
  )
}

/**电缆通道明细操作 */

interface CableChannelDetailParams {
  id: string
  componentId: string
  materialId: string
  cableChannelId: string
  channelName: string
  itemId: string
  itemName: string
  itemNumber: number
  isComponent: number
  unit: string
  itemType: string
}

//获取单条明细数据
export const getCableChannelDetailItem = (libId: string, id: string) => {
  return cyRequest<CableChannelDetailParams>(() =>
    request(`${baseUrl.resource}/CableChannelDetails/GetById`, {
      method: 'GET',
      params: { libId, id },
    })
  )
}

//新增电缆井明细
export const addCableChannelDetailItem = (params: CableChannelDetailParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/CableChannelDetails/SaveCreate`, { method: 'POST', data: params })
  )
}

//编辑明细
export const updateCableChannelDetailItem = (params: CableChannelDetailParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/CableChannelDetails/SaveModify`, { method: 'POST', data: params })
  )
}

// 删除明细
export const deleteCableChannelDetailItem = (libId: string, id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/CableChannelDetails/Delete`, {
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
export const getCableChannelDetaiList = (
  libId: string,
  cableChannelIds: string[],
  keyWord: string
) => {
  return cyRequest<ComponentDetaiListlParams>(() =>
    request(`${baseUrl.resource}/cableChannelDetails/GetPageList`, {
      method: 'POST',
      data: { libId, cableChannelIds, keyWord },
    })
  )
}
interface ItemType {
  itemId: string
  itemType: string
  itemNumber: number
}
//更新明细数据列表
export const updateCableChannelDetaiList = (
  libId: string,
  cableChannelId: string,
  items: ItemType[]
) => {
  return cyRequest<ComponentDetaiListlParams>(() =>
    request(`${baseUrl.resource}/cableChannelDetails/SaveBatchCreate`, {
      method: 'POST',
      data: { libId, cableChannelId, items },
    })
  )
}
