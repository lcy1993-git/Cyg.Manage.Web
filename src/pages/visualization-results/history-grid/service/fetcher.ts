import { baseUrl, cyRequest } from '@/services/common'
import request from 'umi-request'
import { head } from 'lodash'
import { CommentType } from '@/services/visualization-results/side-popup'

// 获取历史网架版本
export const getAllGridVersions = (includeDeleted = false) => {
  return request(`${baseUrl.netFrameworkHistory}/NetFrameworkHistory/AllVersions`, {
    method: 'GET',
    params: { includeDeleted },
  })
}
// 通过id获取历史网架版本
export const getHistoriesById = (versionId: string) => {
  return request(`${baseUrl.netFrameworkHistory}/NetFrameworkHistory/Histories/${versionId}`, {
    method: 'GET',
  })
}

// 删除历史网架版本
export const DeleteGridVersions = (versionId: string, password: string) => {
  return cyRequest<CommentType[]>(() =>
    request(`${baseUrl.netFrameworkHistory}/NetFrameworkHistory/Version/${versionId}`, {
      method: 'DELETE',
      headers: {
        UserPwd: password,
      },
    })
  )
}
