import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'
import { PowerSupplyType, TransformerSubstationType } from './interface'

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

/** 获取变电站下面的网架数据 **/
export const featchSubstationTreeData = (params: string[]) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.grid}/Line/GetLineCompoment`, { method: 'POST', data: params })
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
