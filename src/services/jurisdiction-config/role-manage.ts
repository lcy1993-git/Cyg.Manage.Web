import request from '@/utils/request'
import { cyRequest, baseUrl } from '../common'

export enum BelongModuleEnum {
  '平台管理员' = 1,
  '超级管理员',
  '公司管理员',
}
interface RoleManageItemParams {
  //角色名
  roleName: string

  //角色类型
  roleType: number

  //备注
  remark: string

  //角色类型名称
  roleTypeText: string
}

interface ItemDetailData extends RoleManageItemParams {
  id: string
}

//获取选中数据
export const getRoleManageDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/Role/GetById`, { method: 'GET', params: { id } })
  )
}

//新增角色
export const addRoleManageItem = (params: RoleManageItemParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Role/Create`, { method: 'POST', data: params })
  )
}

//编辑角色名
export const updateRoleManageItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Role/Modify`, { method: 'POST', data: params })
  )
}
