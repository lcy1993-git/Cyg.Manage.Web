import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'
import { PowerSupplyType, TransformerSubstationType } from './interface'

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
