import request from '@/utils/request'
import { cyRequest, baseUrl } from '../common'

// 查询总算表数据
export const queryEngineeringInfoCostTotal = (engineeringTemplateId: string) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.tecEco1}/EngineeringTotal/QueryEngineeringInfoCostTotal`, {
      method: 'GET',
      params: { engineeringTemplateId },
    })
  )
}

// 导入总算表
export const importEngineeringInfoCostTotal = (EngineeringTemplateId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/EngineeringTotal/QueryEngineeringInfoCostTotal`, {
      method: 'POST',
      data: { EngineeringTemplateId },
    })
  )
}
