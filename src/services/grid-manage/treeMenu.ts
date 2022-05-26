import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

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
