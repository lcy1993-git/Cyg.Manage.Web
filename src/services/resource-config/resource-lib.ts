import request from '@/utils/request'
import qs from 'qs'
import { cyRequest, baseUrl } from '../common'

interface ResourceLibParams {
  libName: string
  rootDirPath: string
  dbName: string
  version: string
  remark: string
  isDisabled: boolean
}

interface ItemDetailData extends ResourceLibParams {
  //公司编号
  id: string
}

//获取资源库详情
export const getResourceLibDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.resource}/ResourceLib/GetById`, { method: 'GET', params: { id } })
  )
}

//新增资源库
export const addResourceLibItem = (params: ResourceLibParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ResourceLib/SaveCreate`, { method: 'POST', data: params })
  )
}

//编辑资源库信息
export const updateResourceLibItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ResourceLib/Modify`, { method: 'POST', data: params })
  )
}

// 删除资源库.?
export const deleteResourceLibItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ResourceLib/Delete`, { method: 'GET', params: { id } })
  )
}

export const restartResourceLib = () => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ResourceLib/RestartService`, { method: 'POST' })
  )
}

export const uploadDrawing = (files: any[], params: any) => {
  const formData = new FormData()
  files.forEach((item) => {
    formData.append('file', item)
  })

  const uploadUrl = `${baseUrl.upload}/Upload/Chart?${qs.stringify(params)}`

  return cyRequest<any[]>(() =>
    request(uploadUrl, {
      method: 'POST',
      data: formData,
      requestType: 'form',
    })
  )
}

//启用/禁用 资源库
export const changeLibStatus = (params: { id: string; status: number }) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/ResourceLib/UpdateStatus`, { method: 'POST', data: params })
  )
}
//获取公司资源库列表
export const getCampanyResourceLibLists = (params: { libType: number; libSource: string }) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.resource}/ResourceLib/GetPageList`, { method: 'POST', data: params })
  )
}
//创建公司资源库
export const creatCampanyResourceLib = (params: {
  libType: number
  libSource: string
  libName: string
  version: string
  remark: string
}) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.resource}/ResourceLib/SaveCreate`, { method: 'POST', data: params })
  )
}
