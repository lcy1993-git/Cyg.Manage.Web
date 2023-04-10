import request from '@/utils/request'
import { cyRequest, baseUrl } from '../common'

export enum BelongManageEnum {
  '全部',
  '启用',
  '禁用',
}

export enum BelongStatusEnum {
  '启用' = 1,
  '禁用',
}

export enum BelongUserRoleEnum {
  '平台管理员' = 1,
  '超级管理员',
  '公司管理员',
}

interface ManageUserItemParams {
  companyName: string
  userType: number
  userTypeText: string
  userName: string
  phone: string
  email: string
  name: string
  userStatus: number
  lastLoginIp: string
  lastLoginDate: Date
  pwd: string
}

interface AddManageUserItem extends ManageUserItemParams {
  companyId: string
}

export interface ItemDetailData extends ManageUserItemParams {
  id: string
  pwd: string
}

//获取选中数据
export const getManageUserDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/ManageUser/GetById`, { method: 'GET', params: { id } })
  )
}

//新增用户
export const addManageUserItem = (params: AddManageUserItem) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ManageUser/Create`, { method: 'POST', data: params })
  )
}

//编辑用户
export const updateManageUserItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ManageUser/Modify`, { method: 'POST', data: params })
  )
}

//修改（重置）密码
export const resetItemPwd = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ManageUser/ResetPwd`, { method: 'POST', data: params })
  )
}

// 更改状态
export const updateItemStatus = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ManageUser/ChangeState`, { method: 'GET', params: { id } })
  )
}

//获取省份
export const getProvince = (pid: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Area/GetList`, { method: 'GET', params: { pid } })
  )
}
