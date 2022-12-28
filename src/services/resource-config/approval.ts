import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

// 获取审批列表
export const getResourceLibApprovalList = () => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/UserActionResource/GetResourceLibApprovalList`, {
      method: 'POST',
      data: {},
    })
  )
}
// 通过或驳回审批
export const resourceLibApproval = (params: { id: string; state: number; failRemark?: string }) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/UserActionResource/ResourceLibApproval`, {
      method: 'POST',
      data: params,
    })
  )
}
