import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

export enum LayerTypes {
  '勘察图层' = 1,
  '方案图层' = 2,
  '设计图层' = 4,
  '拆除图层' = 8,
}

export enum ElementTypes {
  '杆塔' = 1,
  '电缆井' = 2,
  '电气设备' = 4,
  '变压器' = 8,
  '地物' = 16,
  '户表' = 32,
  '电缆通道' = 64,
  '线路' = 128,
  '下户线' = 256,
  '辅助线' = 512,
  '故障指示器' = 1024,
  '横担' = 2048,
  '穿孔' = 4096,
  '杆上设备' = 8192,
  '电缆头' = 16384,
  '撑杆' = 32768,
  '拉线' = 65536,
  '水平拉线' = 131072,
}

interface VisualConfigParams {
  layerTypes: []
  minZoomLevel: number
  maxZoomLevel: number
  elementTypes: []
  limitQty: number
  remark: string
}

export interface ItemParams extends VisualConfigParams {
  id: string
}

//新增配置
export const addVisualConfigItem = (params: VisualConfigParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/MapElementQueryConfig/Create`, { method: 'POST', data: params })
  )
}

//编辑配置
export const modifyVisualConfigItem = (params: ItemParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/MapElementQueryConfig/Modify`, { method: 'POST', data: params })
  )
}

//删除配置
export const deleteVisualConfigItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/MapElementQueryConfig/DeleteById`, {
      method: 'Get',
      params: { id },
    })
  )
}

// 更改状态
export const updateConfigStatus = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/MapElementQueryConfig/ChangeState`, {
      method: 'GET',
      params: { id },
    })
  )
}

//获取选中数据
export const getVisualConfigItem = (id: string) => {
  return cyRequest<ItemParams>(() =>
    request(`${baseUrl.project}/MapElementQueryConfig/GetById`, { method: 'GET', params: { id } })
  )
}

// export const testGet = () => {
//   return cyRequest(() => request(`${baseUrl.manage}/PowerSupply/Tree`, { method: 'GET' }))
// }
