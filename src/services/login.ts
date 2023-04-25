import request from '@/utils/request'
import { baseUrl, cyRequest } from '@/services/common'
import { ModulesItem, UserInfo } from './common.d'
import { generateUUID, handleSM2Crypto } from '@/utils/utils'

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
  params['reqid'] = generateUUID()
  params['pwd'] = handleSM2Crypto(params.pwd)
  params['clientType'] = '2'
  params['timestamp'] = `${Date.parse(`${new Date()}`)}`

  return request<LoginSuccessInfo>(`${baseUrl.common}/Users/SignIn`, {
    method: 'POST',
    data: handleSM2Crypto(JSON.stringify(params)),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

// ---
export const userLoginRequest = (params: UserLoginParams) => {
  params['reqid'] = generateUUID()
  params['pwd'] = handleSM2Crypto(params.pwd)
  params['clientType'] = '2'
  params['timestamp'] = `${Date.parse(`${new Date()}`)}`
  return request(`${baseUrl.common}/Users/SignIn`, {
    method: 'POST',
    data: handleSM2Crypto(JSON.stringify(params)),
    headers: {
      'Content-Type': 'application/json',
    },
  })
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
  return request<LoginSuccessInfo>(`${baseUrl.common}/Users/GetAccessTokenByTicket`, {
    method: 'POST',
    data: { ...params, appType: 2 },
  })
}

//qgc获取ticket
export const getTicketForDesign = (params: any) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.common}/Users/getSignInTicket`, {
      method: 'POST',
      data: { ...params, appType: 8, appKey: '186de47fa894297' },
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
export const compareVerifyCode = (category: number, code: string) => {
  return request(`${baseUrl.common}/VerifyCode/Compare`, {
    method: 'POST',
    data: { category, code },
  })
}

// 获取用户信息
export const getUserInfoRequest = () => {
  return cyRequest(() => request(`${baseUrl.project}/Manage/GetCurrentUserInfo`, { method: 'GET' }))
}
// 获取公共服务用户信息
export const GetCommonUserInfo = () => {
  return cyRequest<any>(() => request(`${baseUrl.common}/Users/GetInfo`, { method: 'GET' }))
}
// 获取该用户管理端权限
export const getAuthorityModules = () => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Manage/GetAuthorityModules`, { method: 'GET' })
  )
}

// 根据用户名修改密码
export const modifyPwdByUserName = (value: {
  userName: string
  oldPwd: string
  newPwd: string
}) => {
  return cyRequest(() =>
    request(`${baseUrl.common}/Users/ModifyPwdByUserName`, {
      method: 'POST',
      data: {
        userName: value.userName,
        oldPwd: handleSM2Crypto(value.oldPwd),
        newPwd: handleSM2Crypto(value.newPwd),
      },
    })
  )
}
