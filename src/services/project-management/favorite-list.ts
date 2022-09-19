/* 工程收藏夹接口 */
import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

// 创建收藏夹
export const creatFavorite = (params: { name: string | undefined; parentId?: string }) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ProjectDirectory/Create`, { method: 'POST', data: params })
  )
}

//修改收藏夹名称
export const modifyFavoriteName = (params: { id: string; name: string }) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ProjectDirectory/Modify`, { method: 'POST', data: params })
  )
}

//删除收藏夹
export const deleteFavorite = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ProjectDirectory/DeleteById`, {
      method: 'GET',
      params: { id: id },
    })
  )
}

//添加收藏项目
export const addCollectionEngineers = (params: { id: string; projectIds: string[] }) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ProjectDirectory/AddProjects`, {
      method: 'POST',
      data: params,
    })
  )
}

//移除收藏项目
export const removeCollectionEngineers = (params: { id: string; projectIds: string[] }) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/ProjectDirectory/RemoveProjects`, {
      method: 'POST',
      data: params,
    })
  )
}
//移除收藏项目
export const recycleCollectionProject = (params: { projectIds: string[] }) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Porject/Restore`, {
      method: 'POST',
      data: params,
    })
  )
}

// 获取收藏夹
export const getFavorites = () => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.project}/ProjectDirectory/GetTree`, { method: 'GET' })
  )
}
