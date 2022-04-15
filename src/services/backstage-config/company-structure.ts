import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

interface CompanyStructureSearchParams {
  keyWord: string
}

//获取公司列表
export const getCompanyStructureTreeList = (params: CompanyStructureSearchParams) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.project}/CompanyTree/GetTreeList`, { method: 'POST', data: params })
  )
}

interface AddCompanyParams {
  parentId: string
  companyId: string
}

// 新增公司
export const addCompany = (data: AddCompanyParams) => {
  return cyRequest(() => request(`${baseUrl.project}/CompanyTree/Create`, { method: 'POST', data }))
}

// 修改公司

interface EditCompanyParams {
  sourceCompanyId: string
  replaceTargetCompanyId: string
}

export const editCompany = (data: EditCompanyParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyTree/Replace`, { method: 'POST', data })
  )
}

export const deleteCompany = (companyId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyTree/Delete`, { method: 'GET', params: { companyId } })
  )
}
