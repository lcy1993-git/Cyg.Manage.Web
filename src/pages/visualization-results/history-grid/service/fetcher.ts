import { baseUrl } from '@/services/common'
import request from 'umi-request'

// 获取历史网架版本
export const getAllGridVersions = (includeDeleted = false) => {
  return request(`${baseUrl.netFrameworkHistory}/NetFrameworkHistory/AllVersions`, {
    method: 'GET',
    params: { includeDeleted },
  })
}

// 删除历史网架版本
export const DeleteGridVersions = (versionId: string, password: string) => {
  return request(`${baseUrl.netFrameworkHistory}/NetFrameworkHistory/Version/{versionId}`, {
    method: 'DELETE',
    header: {
      UserPwd: password,
    },
  })
}
