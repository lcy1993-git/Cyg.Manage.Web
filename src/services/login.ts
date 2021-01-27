import {request} from "umi";
import {baseUrl} from "@/services/common"

export interface UserLoginParams {
    userName: string
    pwd: string
}

export const userLoginRequest = (params: UserLoginParams) => {
    return request(`${baseUrl.project}/Manage/SignIn`,{method: "POST", data: params});
}

export interface PhoneLoginParams {
    phone: string
    code: string
}

export const phoneLoginRequest = (params: PhoneLoginParams) => {
    return request(`${baseUrl.project}/Manage/SignInByPhone`,{method: "POST", data: params});
}