import request from '@/utils/request'
import qs from 'qs'
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

  const uploadUrl = `${baseUrl[requestSource]}${url}?${qs.stringify(params)}`

  return request(uploadUrl, {
    method: 'POST',
    data: formData,
    requestType: 'form',
  }).then((res) => {
    const { code, isSuccess, message: msg } = res
    if (code === 6000) {
      return Promise.resolve(res)
    }
    if (isSuccess) {
      return Promise.resolve(res)
    } else {
      return Promise.reject(res)
    }
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

  const uploadUrl = `${baseUrl[requestSource]}${url}?${qs.stringify(params)}`
  return request(uploadUrl, {
    method: 'POST',
    data: formData,
    requestType: 'form',
    // signal,
  }).then((res) => {
    const { code, isSuccess, message: msg } = res
    if (code === 6000) {
      return Promise.resolve(res)
    }
    if (isSuccess) {
      return Promise.resolve(res)
    } else {
      return Promise.reject(res)
    }
  })
  // .catch((err) => {
  //   if (err.name === 'AbortError') {
  //     console.log('aborted');
  //   } else {
  //     console.log('error');
  //   }
  // });
}

interface DeleteItemParams {
  libId: string
  ids: string[]
}
// 删除物料
export const deleteDrawingItems = (params: DeleteItemParams) => {
  return cyRequest(() =>
    request(`${baseUrl.resource}/Chart/Delete`, { method: 'POST', data: params })
  )
}
