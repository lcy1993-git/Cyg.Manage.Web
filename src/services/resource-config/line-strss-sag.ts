import request from '@/utils/request'
import { cyRequest, baseUrl } from '../common'

interface LineStressSagParams {
  id: string
  resourceLibId: string
  stress: number
  comparativeLoad: number
  kValue: number
}

//编辑应力弧垂表数据
export const updateLineStressSagItem = (params: LineStressSagParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/LineStressSag/SaveLineStressSagMappingModify`, {
      method: 'POST',
      data: params,
    })
  )
}
