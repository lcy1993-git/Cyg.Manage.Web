import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

// 获取审批列表组
export const getResourceLibApprovalGroupList = (params: { keyword: string }) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/UserActionResource/GetResourceLibApprovalGroupList`, {
      method: 'POST',
      data: params,
    })
  )
}
// 获取审批列表
export const getResourceLibApprovalList = (params: { createdBy: string; targetId: string }) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.resource}/UserActionResource/GetResourceLibApprovalList`, {
      method: 'POST',
      data: params,
    })
  )
}
// 通过或驳回审批
export const resourceLibApproval = (params: {
  ids: string[]
  state: number
  approvalRemark?: string
}) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/UserActionResource/ResourceLibApproval`, {
      method: 'POST',
      data: params,
    })
  )
}
