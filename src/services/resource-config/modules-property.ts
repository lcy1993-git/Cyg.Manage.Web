import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

interface ModulesPropertyParams {
  libId: string
  moduleId: string
  moduleName: string
  shortName: string
  typicalCode: string
  poleTypeCode: string
  unit: string
  moduleType: string
  forProject: string
  forDesign: boolean
  remark: string
  processChartIds: string[]
  towerModelChartIds: string[]
  designChartIds: string[]
}

interface ItemDetailData extends ModulesPropertyParams {
  //模块id
  id: string
}

interface ModuleAttributeParams extends ItemDetailData {
  height: number
  depth: number
  nominalHeight: number
  steelStrength: string
  poleStrength: string
  rodDimaeter: number
  baseWeight: number
  segmentMode: string
  earthwork: string
  arrangement: string
  meteorologic: string
  loopNumber: string
  lineNumber: number
  conductorType: string
  conductorSpec: string
  rodDiameter: number
}

//获取单条模块数据详情
export const getModulesPropertyDetail = (libId: string, id: string) => {
  return cyRequest<ModuleAttributeParams>(() =>
    request(`${baseUrl.resource}/Modules/GetById`, { method: 'GET', params: { libId, id } })
  )
}

//新增模块
export const addModulesPropertyItem = (params: ModulesPropertyParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Modules/SaveCreate`, { method: 'POST', data: params })
  )
}

//编辑模块
export const updateModulesPropertyItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Modules/SaveModify`, { method: 'POST', data: params })
  )
}

// 删除
export const deleteModulesPropertyItem = (params: { libId: string; ids: string[] }) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Modules/Delete`, { method: 'POST', data: params })
  )
}

//获取单条数据属性数据
export const getModuleAttribute = (libId: string, mid: string) => {
  return cyRequest<ModuleAttributeParams>(() =>
    request(`${baseUrl.resource}/ModulesProperty/GetById`, {
      method: 'GET',
      params: { libId, mid },
    })
  )
}

export const saveModuleAttributeItem = (params: ModuleAttributeParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ModulesProperty/SaveModify`, { method: 'POST', data: params })
  )
}

/**模块明细部分接口 */

interface ModuleDetailParams {
  id: string
  componentId: string
  materialId: string
  moduleId: string
  moduleName: string
  part: string
  itemId: string
  itemName: string
  itemNumber: number
  isComponent: number
  itemType: string
  unit: string
}

//获取单条明细数据
export const getModuleDetailItem = (libId: string, id: string) => {
  return cyRequest<ModuleDetailParams>(() =>
    request(`${baseUrl.resource}/ModulesDetails/GetById`, { method: 'GET', params: { libId, id } })
  )
}

//新增明细
export const addModuleDetailItem = (params: ModuleDetailParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ModulesDetails/SaveCreate`, { method: 'POST', data: params })
  )
}

//编辑明细
export const updateModulesDetailItem = (params: ModuleDetailParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ModulesDetails/SaveModify`, { method: 'POST', data: params })
  )
}

// 删除明细
export const deleteModulesDetailItem = (libId: string, id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ModulesDetails/Delete`, { method: 'POST', params: { libId, id } })
  )
}

/**模块明细操作 */
// 获取明细列表
interface ComponentDetaiListlParams {
  items: any[]
}
//获取明细数据列表
export const getModuleDetaiList = (libId: string, moduleIds: string[], keyWord: string) => {
  return cyRequest<ComponentDetaiListlParams>(() =>
    request(`${baseUrl.resource}/ModulesDetails/GetPageList`, {
      method: 'POST',
      data: { libId, moduleIds, keyWord, pageSize: 200, pageIndex: 1 },
    })
  )
}
interface ItemType {
  itemId: string
  itemType: string
  itemNumber: number
}
//更新明细数据列表
export const updateModulelDetaiList = (libId: string, moduleId: string, items: ItemType[]) => {
  return cyRequest<ComponentDetaiListlParams>(() =>
    request(`${baseUrl.resource}/ModulesDetails/SaveBatchCreate`, {
      method: 'POST',
      data: { libId, moduleId, items },
    })
  )
}
