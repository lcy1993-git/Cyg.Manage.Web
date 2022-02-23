import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

interface UpdateCompanyStatus {
  companyId: string
  isFilterTree: boolean
}

export const updateCompanyStatus = (params: UpdateCompanyStatus) => {
  return cyRequest(() =>
    request(
      `${baseUrl.project}/CompanyTree/SaveCompanyConfig
    `,
      { method: 'POST', data: params }
    )
  )
}
