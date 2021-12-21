import request from '@/utils/request'
import { cyRequest, baseUrl } from '../common'

interface WareHouseParams {
  province: string
  name: string
  version: string
  remark: string
  companyId: string
}

interface ItemDetailData extends WareHouseParams {
  //利库编号
  id: string
  overviewId: string
}

export enum CreateMethod {
  '自动' = 1,
  '手动',
}

//获取协议库存列表
export const getInventoryOverviewList = () => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.resource}/Inventory/GetInventoryOverviewList`, { method: 'GET' })
  )
}

// 根据InventoryOverviewId 获得 ResourceLibId
export const getResourceLibId = (inventoryOverviewId: string) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.resource}/Inventory/GetInventoryOverview`, {
      method: 'GET',
      params: { inventoryOverviewId },
    })
  )
}

// 获取创建映射的地区
export const getAreaList = (inventoryOverviewId: string) => {
  return cyRequest<string[]>(() =>
    request(`${baseUrl.resource}/Inventory/GetInventoryAreaList`, {
      method: 'GET',
      params: { inventoryOverviewId },
    })
  )
}

// 获取已经映射了的数据
export const getHasMapData = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.resource}/Inventory/GetHasMappingInventoryList`, {
      method: 'POST',
      data: params,
    })
  )
}

// 保存映射
export const saveMapData = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.resource}/Inventory/SaveCreateMapping`, { method: 'POST', data: params })
  )
}

//映射资源库
export const createResourceInventoryMap = (params: {
  resourceLibId: string
  inventoryOverviewId: string
  remark: string
}) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Inventory/CreateResourceInventoryMapping`, {
      method: 'POST',
      data: params,
    })
  )
}

//删除当前已映射资源库和协议库存
export const deleteResourceInventoryMap = (params: { mappingId: string }) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Inventory/DeleteResouceInventoryMapping`, {
      method: 'POST',
      data: params,
    })
  )
}
