import { baseUrl, cyRequest } from '@/services/common'
import request from '@/utils/request'
import { ModulesItem, UserInfo } from './common.d'
export interface UserLoginParams {
  userName: string
  pwd: string
}

interface LoginSuccessContent {
  accessToken: string
  modules: ModulesItem[]
  user: UserInfo
}

interface LoginSuccessInfo {
  code: number
  content: LoginSuccessContent | null
  isSuccess: boolean
  message: string
  traceId: string
}

export const indexLoginRequest = (params: UserLoginParams) => {
  return request<LoginSuccessInfo>(`${baseUrl.common}/Users/SignIn`, {
    method: 'POST',
    data: { ...params, clientType: 2 },
  })
}

// ---
export const userLoginRequest = (params: UserLoginParams) => {
  return cyRequest<LoginSuccessContent>(() =>
    request(`${baseUrl.common}/Users/SignIn`, {
      method: 'POST',
      data: { ...params, clientType: 2 },
    })
  )
}
// qgc登录
export const qgcLoginRequest = (params: UserLoginParams) => {
  return cyRequest<LoginSuccessInfo>(() =>
    request(`${baseUrl.common}/myLoging/getUserInfo`, {
      method: 'POST',
      data: { ...params, clientType: 2 },
    })
  )
}
// qgc免登录
export const qgcAutoLoginRequest = (params: any) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.common}/Users/GetAccessTokenByTicket`, {
      method: 'POST',
      data: { ...params, appType: 2 },
    })
  )
}
export interface PhoneLoginParams {
  phone: string
  code: string
}

export const phoneLoginRequest = (params: PhoneLoginParams) => {
  return request(`${baseUrl.common}/Users/SignInByPhone`, {
    method: 'POST',
    data: { ...params, clientType: 2 },
  })
}

// 注销登录
export const signOut = () => {
  return cyRequest(() => request(`${baseUrl.common}/Users/SignOut`, { method: 'POST' }))
}

// 图形验证码校验
export const compareVerifyCode = (key: string, code: string) => {
  return request(`${baseUrl.common}/VerifyCode/Compare`, { method: 'POST', data: { key, code } })
}

// 获取用户信息
export const getUserInfoRequest = () => {
  return cyRequest(() => request(`${baseUrl.project}/Manage/GetCurrentUserInfo`, { method: 'GET' }))
}
// 获取该用户管理端权限
export const getAuthorityModules = () => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Manage/GetAuthorityModules`, { method: 'GET' })
  )
}
