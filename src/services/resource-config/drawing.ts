import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

export const getDrawingList = (libId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Chart/GetList`, { method: 'POST', params: { libId } })
  )
}

//密钥接口
interface SecurityParams {
  storageApi: string
  uploadChartApiSecurity: string
  uploadCompanyFileApiSecurity: string
  uploadLineStressChartApiSecurity: string
  logFileApiSecurity: string
  projectEarlyWarnDay: string
  setCompanyFileByCompanyId: string
  webGisUrl: string
  userNamePrefix: string
  logoUrl: string
  companyName: string
  publicApi: string
}

export const getUploadUrl = () => {
  return cyRequest<SecurityParams>(() =>
    request(`${baseUrl.resource}/Chart/GetUrlSetting`, { method: 'GET' })
  )
}

//上传应力弧垂表图纸
export const uploadLineStressSag = (
  files: any[],
  params: any,
  requestSource: 'project' | 'resource' | 'upload',
  url: string
) => {
  const formData = new FormData()
  files?.forEach((item) => {
    formData.append('file', item)
  })

  const uploadUrl = `${baseUrl[requestSource]}${url}`

  return request(uploadUrl, {
    method: 'POST',
    params: params,
    data: formData,
    requestType: 'form',
  })
}

export const newUploadLineStressSag = (
  files: any[],
  params: any,
  requestSource: 'project' | 'resource' | 'upload',
  url: string
) => {
  const formData = new FormData()
  files.forEach((item) => {
    formData.append('file', item)
  })

  // const controller = new AbortController();
  // const { signal } = controller;

  const uploadUrl = `${baseUrl[requestSource]}${url}`
  return request(uploadUrl, {
    method: 'POST',
    params: params,
    data: formData,
    requestType: 'form',
    // signal,
  })
}

interface DeleteItemParams {
  libId: string
  ids: string[]
}
// 删除图纸
export const deleteDrawingItems = (params: DeleteItemParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Chart/Delete`, { method: 'POST', data: params })
  )
}

// 新建图纸
export const addDrawingItem = (params: any) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Chart/SaveCreate`, { method: 'POST', data: params })
  )
}
