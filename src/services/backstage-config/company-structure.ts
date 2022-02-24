import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

interface CompanyStructureSearchParams {
  keyWord: string
}

//获取公司列表
export const getCompanyStructureTreeList = (params: CompanyStructureSearchParams) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.project}/CompanyTree/GetTreeList`, { method: 'GET', params })
  )
}

interface AddCompanyParams {
  parentId: string
  companyId: string
}

// 新增公司
export const addCompany = (data: AddCompanyParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyTree/AddCompany`, { method: 'POST', data })
  )
}

// 修改公司

interface EditCompanyParams {
  sourceCompanyId: string
  targetCompanyId: string
}

export const editCompany = (data: EditCompanyParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyTree/ModifyCompany`, { method: 'POST', data })
  )
}

export const deleteCompany = (data: { companyId: string }) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyTree/DeleteCompanyTree`, { method: 'POST', data })
  )
}
