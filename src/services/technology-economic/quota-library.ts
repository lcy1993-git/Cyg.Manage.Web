import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'
const formData = (params: Object) => {
  const form = new FormData()
  for (let k in params) {
    if (k === 'file' || k === 'files') {
      form.append(k, params[k]?.[0])
    } else {
      form.append(k, params[k])
    }
  }
  return form
}
// 定额库 - 列表查询
export const getQuotaLibrary = (keyWord: string = '') => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibraryManager/GetPageList`, {
      method: 'POST',
      data: { pageIndex: 1, pageSize: 3000, keyWord },
    })
  )
}
// 定额库 - 编辑
interface ModifyParams {
  id: string
  name: string
  remark: string
}
export const modifyQuotaLibrary = (params: ModifyParams) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibraryManager/SaveModify`, { method: 'POST', data: params })
  )
}
// 定额库 - 添加
interface CreateParams {
  name: string
  category: number
  releaseDate: number
  remark: string
}
export const createQuotaLibrary = (params: CreateParams) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibraryManager/SaveCreate`, { method: 'POST', data: params })
  )
}

// 定额库 - 导入
// export const importQuotaLibrary = (params: CreateParams) => {
//   return cyRequest(() =>
//     request(`${baseUrl.tecEco}/QuotaLibraryManager/Import`, { method: 'POST', data: params })
//   )
// }
export const importQuotaLibrary = (files: any[], libId: string) => {
  const formData = new FormData()
  files.forEach((item) => {
    formData.append('file', item)
  })
  formData.append('libId', libId)
  const uploadUrl = `${baseUrl.tecEco}/QuotaLibraryManager/Import`
  return request(uploadUrl, {
    method: 'POST',
    data: formData,
    requestType: 'form',
  }).then((res) => {
    const { code, isSuccess } = res
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

//定额库 - 删除
export const delQuotaLibrary = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibraryManager/Delete`, { method: 'GET', params: { id } })
  )
}

// 定额库树 /Quota/GetQuotaLibraryCatalogue
// export const getQuotaLibraryTree= (id: string) => {
//   return cyRequest(() =>
//     request(`${baseUrl.tecEco}/Quota/GetQuotaLibraryCatalogue`, { method: 'GET', params: { id } })
//   )
// }

// 定额库目录 - 平铺表格数据列表
export const getCatalogueList = (libId: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibraryCatalogueManager/GetList`, {
      method: 'GET',
      params: { libId },
    })
  )
}
// 查询定额钢筋映射列表
export const queryQuotaRebarMappingList = () => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibrary/QueryQuotaRebarMappingList`, { method: 'GET' })
  )
}
// 导入定额钢筋映射
export const importQuotaRebarMapping = (data: any, urlParams: object) => {
  const url = `${baseUrl.tecEco}/QuotaLibrary/ImportQuotaRebarMapping`

  return cyRequest(() =>
    request(url, {
      method: 'POST',
      params: urlParams,
      data: formData(data),
      requestType: 'form',
    })
  )
}
// 获取定额库目录详情-查看
export const getCatalogueDetaile = () => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibraryCatalogueManager/GetDetail`, {
      method: 'GET',
      params: { id: '1357588635508068352' },
    })
  )
}

// 定额库目录树详情
export const getQuotaLibraryGetDetail = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibraryManager/GetDetail`, { method: 'GET', params: { id } })
  )
}

// 保存添加定额库目录 - 添加
interface CatalogueSaveCreate {
  name?: string
  parentId?: string
  libId?: string
  explain?: string
  sort?: number
}
export const catalogueSaveCreate = (data: CatalogueSaveCreate) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibraryCatalogueManager/SaveCreate`, { method: 'PORT', data })
  )
}

// 定额库目录 - 编辑
export const catalogueModify = (data: CatalogueSaveCreate) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibraryCatalogueManager/SaveModify`, { method: 'PORT', data })
  )
}

// 定额库目录删除
export const catalogueDel = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibraryCatalogueManager/Delete`, {
      method: 'GET',
      params: { id },
    })
  )
}

// 获取定额目录树
export const getTreeQuotaLibraryCatalogue = () => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaLibraryCatalogueManager/GetTree`, {
      method: 'GET',
      params: { libId: '1357588635508068352' },
    })
  )
}

// 定额项 - 获取定额项列表
export const getProjectList = (catalogueId: string, keyWord = '') => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco}/QuotaManager/GetList`, {
      method: 'POST',
      data: { catalogueId, keyWord },
    })
  )
}
