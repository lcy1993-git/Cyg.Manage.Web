/* eslint-disable no-async-promise-executor */
import { webConfig } from '@/global'
import tokenRequest from '@/utils/request'
import { handleDecrypto } from '@/utils/utils'
import { message } from 'antd'
import { isArray } from 'lodash'
import { history, request } from 'umi'
import type { RequestDataCommonType, RequestDataType } from './common.d'

export const geoServeUrl = webConfig.requestUrl.geoServerUrl

export const baseUrl = webConfig.requestUrl

export const cyRequest = <T extends {}>(func: () => Promise<RequestDataType<T>>): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    const res = await func()
    const decryptoRes = handleDecrypto(res)
    if (!decryptoRes) {
      reject(null)
      return
    }
    const { code, content, isSuccess, data } = decryptoRes

    if (isSuccess && code === 200) {
      if (content) {
        resolve(content)
      } else {
        resolve(data)
      }
    } else {
      if (code === 401) {
        if (history.location.pathname === '/again-login') {
          return
        }
        history.push('/again-login')
        // message.error('会话超时，已自动跳转到登录界面');
      } else {
        // eslint-disable-next-line no-lonely-if
        if (decryptoRes.content && isArray(decryptoRes.content) && decryptoRes.content.length > 0) {
          const errorMsgArray = decryptoRes.content.map((item: any) => item.errorMessages).flat()
          const filterErrorMsg = errorMsgArray.filter((item: any, index: any, arr: any) => {
            return arr.indexOf(item) === index
          })
          const showErrorMsg = filterErrorMsg.join('\n')
          message.error(showErrorMsg)
        } else {
          message.error(decryptoRes.message)
        }
      }
      reject(decryptoRes.message)
    }
  })
}

export const cyCommonRequest = <T extends {}>(
  func: () => Promise<RequestDataCommonType>
): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    const res = await func()
    const decryptoRes = handleDecrypto(res)
    const { code, isSuccess } = decryptoRes
    if (isSuccess && code === 200) {
      resolve(decryptoRes as unknown as T)
    } else {
      message.error(decryptoRes.message)
      reject(decryptoRes.message)
    }
  })
}

export enum SendSmsType {
  '登录',
  '账户绑定',
  '修改密码',
  '重置密码',
  '修改注册手机号',
}

// 获取短信接口
interface GetSmsCodeProps {
  phoneNum: string
  sendSmsType: SendSmsType
}

export const getSmsCode = (params: GetSmsCodeProps) => {
  return cyCommonRequest(() =>
    request(`${baseUrl.common}/ExternalApi/SendSms`, {
      method: 'GET',
      params: { ...params, sendSmsType: params.sendSmsType },
    })
  )
}

export const getDataByUrl = (
  url: string,
  params: object,
  requestSource:
    | 'common'
    | 'project'
    | 'resource'
    | 'tecEco'
    | 'tecEco1'
    | 'component'
    | 'material'
    | 'grid',
  requestType = 'get',
  postType = 'body'
) => {
  const requestFinallyBaseUrl = baseUrl[requestSource]

  if (requestType === 'get') {
    return cyRequest<any[]>(() =>
      tokenRequest(`${requestFinallyBaseUrl}${url}`, { method: requestType, params })
    )
  }
  if (postType === 'body') {
    return cyRequest<any[]>(() =>
      tokenRequest(`${requestFinallyBaseUrl}${url}`, { method: requestType, data: params })
    )
  }
  return cyRequest<any[]>(() =>
    tokenRequest(`${requestFinallyBaseUrl}${url}`, { method: requestType, params })
  )
}

interface GetCommonSelectDataParams {
  url: string
  params?: any
  requestSource?: 'common' | 'project' | 'resource'
  method?: 'get' | 'post'
  postType?: 'body' | 'query'
}

export const getCommonSelectData = <T = any>(data: GetCommonSelectDataParams) => {
  const { url, params, requestSource = 'project', method = 'get', postType } = data

  const requestFinallyBaseUrl = baseUrl[requestSource]
  if (method === 'post') {
    if (postType === 'query') {
      return cyRequest<T[]>(() =>
        tokenRequest(`${requestFinallyBaseUrl}${url}`, { method, params: params })
      )
    }
    return cyRequest<T[]>(() =>
      tokenRequest(`${requestFinallyBaseUrl}${url}`, { method, data: params })
    )
  }

  return cyRequest<T[]>(() =>
    tokenRequest(`${requestFinallyBaseUrl}${url}`, { method, params: params })
  )
}

export const commonUpload = (
  url: string,
  files: any[],
  name: string = 'file',
  requestSource: 'project' | 'resource' | 'upload' | 'tecEco1' | 'tecEco',
  extraParams?: Record<string, any>
  // postType: 'body' | 'query',
) => {
  const requestUrl = baseUrl[requestSource]
  const formData = new FormData()
  files.forEach((item) => {
    formData.append(name, item)
  })
  if (extraParams) {
    Object.keys(extraParams).map((key) => {
      formData.append(key, extraParams?.[key])
      return null
    })
  }
  return cyRequest<any[]>(() =>
    tokenRequest(`${requestUrl}${url}`, {
      method: 'POST',
      data: formData,
      params: extraParams,
      // headers:{
      //   'content-Type':'application/zip'
      // },
      requestType: 'form',
    })
  )
}

export const commonExport = (url: string, params: any, selectIds: string[]) => {
  return tokenRequest(`${baseUrl.project}${url}`, {
    method: 'POST',
    data: { ...params, projectIds: selectIds },
    responseType: 'blob',
  })
}

// 导出权限
export const exportAuthority = (url: string, params: any, type: string) => {
  return tokenRequest(`${baseUrl.project}${url}`, {
    method: type,
    data: { ...params },
    responseType: 'blob',
  })
}

// 版本更新内容

interface VersionParams {
  productCode: string
  moduleCode: string
  versionNo: string
  serverCode: string
}

const versionUrl = 'https://bbgl.gczhyun.com/common/api/Version/Get'

export const getVersionUpdate = (params: VersionParams) => {
  return request(versionUrl, { method: 'POST', data: params })
}
