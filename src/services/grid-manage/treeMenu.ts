import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'
import { PowerSupplyType, TransformerSubstationType } from './interface'

const GridManageRequest = (url: string, options?: Parameters<typeof request>[1]) => {
  const _url = `${baseUrl.grid}/${url.startsWith('/') ? url.slice(1) : url}`
  return request(_url, options)
}

/** 导入网架数据 */
export const importGridManageData = (data: FormData) => {
  return GridManageRequest('/Import/Template', {
    method: 'POST',
    data,
    requestType: 'form',
  })
}

/** 下载网架数据模板 */
export const downloadExcelTemplate = () => {
  return GridManageRequest('NetFramework/Templates', { responseType: 'blob' })
}

/** 获取变电站下面的网架数据 **/
export const featchSubstationTreeData = (params: string[]) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/Line/GetLineCompoment`, { method: 'POST', data: params })
  )
}

export const featchPowerSupplyTreeData = (params: { ids: string[] }) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/GridDesign/GetLinesByPower`, { method: 'POST', data: params })
  )
}

export const fetchGridManageMenu = () => {
  return cyRequest<any[]>(() => request(`${baseUrl.grid}/PowerSupply/Tree`, { method: 'GET' }))
}

//变电站树
export const getTransformerSubstationMenu = () => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/TransformerSubstation/Tree`, { method: 'GET' })
  )
}

// 获取所属线路
export const getAllBelongingLineItem = () => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/GridDesign/GetLineItems`, { method: 'GET' })
  )
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

export const deleteCompany = (companyId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyTree/Delete`, { method: 'GET', params: { companyId } })
  )
}

/** 创建变电站 */
export const createTransformerSubstation = (params: TransformerSubstationType) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/TransformerSubstation/Create`, { method: 'POST', data: params })
  )
}
/** 创建电源 */
export const createPowerSupply = (params: PowerSupplyType) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/PowerSupply/Create`, { method: 'POST', data: params })
  )
}

/** 创建杆塔 **/
export const createTower = (params: any) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/Tower/Create`, { method: 'POST', data: params })
  )
}
