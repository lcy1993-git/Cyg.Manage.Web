import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

interface SignFileItemParams {
  name: string
  fileId: string
  category: number[]
  fileCategoryText: string
  userId: string
  describe: string
  createdOn: string
  groupId: string
}

interface ItemDetailData extends SignFileItemParams {
  id: string
}

//获取选中数据
export const getSignFileDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/CompanySign/GetById`, { method: 'GET', params: { id } })
  )
}

//新增签批文件
export const addSignFileItem = (params: SignFileItemParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanySign/Create`, { method: 'POST', data: params })
  )
}

//编辑公司文件
export const updateSignFileItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanySign/Modify`, { method: 'POST', data: params })
  )
}

// 删除公司文件
export const deleteSignFileItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanySign/DeleteById`, { method: 'GET', params: { id } })
  )
}

interface DefaultOptionsParams {
  groupId: string
  approve: string
  audit: string
  calibration: string
  designSurvey: string
  designChiefEngineer: string
}

// //获取文件类别Tree
// export const getCompanyFileTree = () => {
//   return cyRequest<any[]>(() =>
//     request(`${baseUrl.project}/CompanyFile/GetTreeByCategory`, { method: 'GET' }),
//   );
// };

//签批默认参数
export const getSignDefaultOptions = (groupId: string) => {
  return cyRequest<DefaultOptionsParams>(() =>
    request(`${baseUrl.project}/CompanySignGroup/GetDefaultOptions`, {
      method: 'GET',
      params: { groupId },
    })
  )
}

export const updateSignGroupDefaultOptions = (params: DefaultOptionsParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanySignGroup/SaveDefaultOptions`, {
      method: 'POST',
      data: params,
    })
  )
}

export const uploadCompanyFile = (files: any[], params: any, url: string) => {
  const formData = new FormData()
  files.forEach((item) => {
    formData.append('file', item)
  })

  const uploadUrl = `${baseUrl.upload}${url}`

  return cyRequest<string>(() =>
    request(uploadUrl, {
      method: 'POST',
      params: params,
      data: formData,
      requestType: 'form',
    })
  )
}

//签批文件组别接口

interface SignGroupParams {
  name: string
  remark: string
}

export const addSignGroupItem = (params: SignGroupParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanySignGroup/Create`, { method: 'POST', data: params })
  )
}

export const deleteSignGroupItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanySignGroup/DeleteById`, { method: 'GET', params: { id } })
  )
}

//下载公司文件接口
export const downLoadSignFileItem = (params: any) => {
  return request(`${baseUrl.upload}/Download/GetFileById`, {
    method: 'GET',
    params,
    responseType: 'blob',
  })
}
