import request from '@/utils/request'
import { cyRequest, baseUrl } from '../common'

interface DictionaryItemParams {
  parentId: string
  //键
  key: string

  value: string
  extensionColumn: string
  sort: number
  //是否禁用
  isDisable: number

  //备注
  remark: string
}

interface GetPageList {
  parentId: string
  pageIndex: number
  pageSize: number
}

interface ItemDetailData extends DictionaryItemParams {
  id: string
}

//获取选中数据
export const getDictionaryDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/Dictionary/GetById`, { method: 'GET', params: { id } })
  )
}

//新增角色
export const addDictionaryItem = (params: DictionaryItemParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Dictionary/Create`, { method: 'POST', data: params })
  )
}

//编辑角色名
export const updateDictionaryItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Dictionary/Modify`, { method: 'POST', data: params })
  )
}

// 删除
export const deleteDictionaryItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Dictionary/DeleteById`, { method: 'GET', params: { id } })
  )
}

// 更改状态
export const updateDictionaryItemStatus = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Dictionary/ChangeState`, { method: 'GET', params: { id } })
  )
}

// 获取页面数据
export const getDictionaryTList = (id: string): Promise<GetPageList[]> => {
  return cyRequest<GetPageList[]>(() =>
    request(`${baseUrl.project}/Dictionary/GetPagedList`, { method: 'GET', params: { id } })
  )
}
