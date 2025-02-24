import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

interface ComponentParams {
  libId: string
  componentId: string
  componentName: string
  componentSpec: string
  typicalCode: string
  unit: string
  deviceCategory: number
  componentType: string

  kvLevel: string
  forProject: string
  forDesign: string
  remark: string
  // chartIds: string[]
  isElectricalEquipment: boolean
  processChartIds: string[]
}

interface ItemDetailData extends ComponentParams {
  //组件id
  id: string
}

//获取组件详情
export const getComponentDetail = (libId: string, id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.resource}/Component/GetById`, { method: 'GET', params: { libId, id } })
  )
}

//新增组件
export const addComponentItem = (params: ComponentParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Component/SaveCreate`, { method: 'POST', data: params })
  )
}

//编辑组件
export const updateComponentItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Component/SaveModify`, { method: 'POST', data: params })
  )
}

// 删除组件
export const deleteComponentItem = (libId: string, ids: string[]) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Component/Delete`, { method: 'POST', data: { libId, ids } })
  )
}

interface ComponentDetaiListlParams {
  items: any[]
}

//获取明细数据列表
export const getComponentDetaiList = (libId: string, componentIds: string[], keyWord: string) => {
  return cyRequest<ComponentDetaiListlParams>(() =>
    request(`${baseUrl.resource}/ComponentDetail/GetPageList`, {
      method: 'POST',
      data: { libId, componentIds, keyWord, pageSize: 200, pageIndex: 1 },
    })
  )
}
interface ItemType {
  itemId: string
  itemType: string
  itemNumber: number
}
//更新明细数据列表
export const updateComponentDetaiList = (
  libId: string,
  belongComponentId: string,
  items: ItemType[]
) => {
  return cyRequest<ComponentDetaiListlParams>(() =>
    request(`${baseUrl.resource}/ComponentDetail/SaveBatchCreate`, {
      method: 'POST',
      data: { libId, belongComponentId, items },
    })
  )
}
/**组件明细操作 */
interface ComponentDetailParams {
  libId: string
  id: string
  belongComponentId: string
  componentId: string
  componentName: string
  materialId: string
  itemType: number
  itemId: string
  spec: string
  itemName: string
  itemNumber: number
  isComponent: number
  unit: string
}

//获取单条明细数据
export const getComponentDetailItem = (libId: string, id: string) => {
  return cyRequest<ComponentDetailParams>(() =>
    request(`${baseUrl.resource}/ComponentDetail/GetById`, {
      method: 'GET',
      params: { libId, id },
    })
  )
}

//新增电缆井明细
export const addComponentDetailItem = (params: ComponentDetailParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ComponentDetail/SaveCreate`, { method: 'POST', data: params })
  )
}

//编辑明细
export const updateComponentDetailItem = (params: ComponentDetailParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ComponentDetail/SaveModify`, { method: 'POST', data: params })
  )
}

// 删除明细
export const deleteComponentDetailItem = (libId: string, id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ComponentDetail/Delete`, {
      method: 'POST',
      params: { libId, id },
    })
  )
}

/**组件属性操作 */

interface PropertyParams {
  propertyName: string
  propertyValue: string
}

interface ComponentPropertyParams {
  id: string
  componentId: string
  propertyName: string
  propertyValue: string
  items: PropertyParams[]
}

//获取单条明细数据
export const getPropertyList = (params: { libId: string; componentId: string }) => {
  return cyRequest<ComponentPropertyParams[]>(() =>
    request(`${baseUrl.resource}/ComponentProperty/GetList`, {
      method: 'POST',
      data: params,
    })
  )
}

//新增组件属性
export const addComponentPropertyItem = (params: ComponentPropertyParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ComponentProperty/SaveCreate`, { method: 'POST', data: params })
  )
}

//编辑组件属性
export const updateComponentPropertyItem = (params: ComponentPropertyParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ComponentProperty/SaveModify`, { method: 'POST', data: params })
  )
}

// 删除组件属性
export const deleteComponentPropertyItem = (libId: string, id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ComponentProperty/Delete`, {
      method: 'POST',
      params: { libId, id },
    })
  )
}

export const getSpecName = (params: { libId: string; name: string }) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.resource}/Component/GetListByName`, {
      method: 'POST',
      data: params,
    })
  )
}

export const getMaterialSpecName = (params: { libId: string; name: string }) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.resource}/Material/GetListByName`, {
      method: 'POST',
      data: params,
    })
  )
}

export const getMaterialName = (libId: string) => {
  return cyRequest<string[]>(() =>
    request(`${baseUrl.resource}/Material/GetMaterialNameList?libId=${libId}`, { method: 'post' })
  )
}

export const getComponentName = (libId: string) => {
  return cyRequest<string[]>(() =>
    request(`${baseUrl.resource}/Component/GetNameList?libId=${libId}`, { method: 'post' })
  )
}
