import request from '@/utils/request'
import { cyRequest, baseUrl } from '../common'

interface CustomMapParams {
  name: string
  url?: string
  hostId?: string
  minLevel: string
  maxLevel: string
  isEnable?: boolean
}

//获取单条地图源数据
export const getCustomMapDetail = (id: string) => {
  return cyRequest<CustomMapParams>(() =>
    request(`${baseUrl.project}/MapSourceConfig/GetById`, { method: 'GET', params: { id } })
  )
}

//新增电力公司
export const addCustomMapItem = (params: CustomMapParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/MapSourceConfig/Create`, { method: 'POST', data: params })
  )
}

//编辑电力公司
export const modifyCustomMap = (params: CustomMapParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/MapSourceConfig/Modify`, { method: 'POST', data: params })
  )
}

// 删除
export const deleteCustomMap = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/MapSourceConfig/DeleteById`, { method: 'GET', params: { id } })
  )
}

export const importCustomMap = (files: any[]) => {
  const formData = new FormData()
  files.forEach((item) => {
    formData.append('file', item)
  })

  const uploadUrl = `${baseUrl.project}/MapSourceConfig/Import`
  return cyRequest<any[]>(() =>
    request(uploadUrl, {
      method: 'POST',
      data: formData,
      requestType: 'form',
    })
  )
}

// 更改状态
export const updateCustomMapStatus = (params: { id: string; isEnable: boolean }) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/MapSourceConfig/ModifyIsEnable`, { method: 'POST', data: params })
  )
}

//下载模板
export const exportMapTemp = () => {
  return request(`${baseUrl.project}/MapSourceConfig/Export`, {
    method: 'POST',
    data: ['string'],
    responseType: 'blob',
  })
}
