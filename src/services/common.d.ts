export interface RequestDataType<T> {
    code: number
    content: T
    isSuccess: boolean
    message?: string
    data ?: any
    traceId?: string
}

export interface RequestDataCommonType {
    code: number
    isSuccess: boolean
    message: string
    traceId: string
}

export interface ModulesItem {
    authCode: string
    category: number
    children: ModulesItem[]
    icon: string
    name: string
    url: string
}

export interface UserInfo {
    id: string
    userName: string
    roleName: string
    nickName: string
    name: string
    lastLoginIp: string
    companyName: string
}
