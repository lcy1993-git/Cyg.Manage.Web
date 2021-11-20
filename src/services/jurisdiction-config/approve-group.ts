import request from '@/utils/request'
import { cyRequest, baseUrl } from '../common'

export enum BelongRoleEnum {
  '启用' = 1,
  '禁用',
}

interface ApproveGroupParams {
  name: string
  userName: string
  userId: string
  userIds: string[]
  remark: string
}

interface ApproveGroupItem extends ApproveGroupParams {
  id: string
  status?: number
  statusText?: string
  users?: string[]
}

//创建立项审批组
export const createApproveGroup = (params: ApproveGroupParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ProjectApproveGroup/Create`, { method: 'POST', data: params })
  )
}

//编辑组
export const modifyApproveGroup = (params: ApproveGroupItem) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ProjectApproveGroup/Modify`, { method: 'POST', data: params })
  )
}

// 删除组
export const deleteApproveGroup = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ProjectApproveGroup/DeleteById`, { method: 'GET', params: { id } })
  )
}

// 更改状态
export const updateApproveState = (params: { id: string; isEnable: boolean }) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ProjectApproveGroup/ChangeStatus`, {
      method: 'POST',
      data: params,
    })
  )
}

export const getApproveGroupById = (id: string) => {
  return cyRequest<ApproveGroupItem>(() =>
    request(`${baseUrl.project}/ProjectApproveGroup/GetById`, { method: 'GET', params: { id } })
  )
}

//获取成员列表
export const getGroupUser = (params: { category: number; groupId?: string | undefined }) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.project}/ProjectApproveGroup/GetUserList`, {
      method: 'POST',
      data: params,
    })
  )
}
