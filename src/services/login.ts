import {request} from "umi";
import {baseUrl, cyRequest} from "@/services/common"
import {ModulesItem,UserInfo} from "./common.d";
export interface UserLoginParams {
    userName: string
    pwd: string
}



interface LoginSuccessInfo {
    accessToken: string
    modules: ModulesItem[]
    user: UserInfo
}

export const userLoginRequest = (params: UserLoginParams) => {
    return cyRequest<LoginSuccessInfo>(() => request(`${baseUrl.project}/Manage/SignIn`,{method: "POST", data: params}));
}

export interface PhoneLoginParams {
    phone: string
    code: string
}

export const phoneLoginRequest = (params: PhoneLoginParams) => {
    return cyRequest<LoginSuccessInfo>(() => request(`${baseUrl.project}/Manage/SignInByPhone`,{method: "POST", data: params}))
}