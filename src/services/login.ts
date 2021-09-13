import request from "@/utils/request";
import {baseUrl, cyRequest} from "@/services/common"
import {ModulesItem,UserInfo} from "./common.d";
export interface UserLoginParams {
    userName: string
    pwd: string
}



interface LoginSuccessContent {
    accessToken: string;
    modules: ModulesItem[];
    user: UserInfo;
}

interface LoginSuccessInfo {
    code: number;
    content: LoginSuccessContent | null;
    isSuccess: boolean;
    message: string;
    traceId: string;
}

// ---
export const userLoginRequest = (params: UserLoginParams) => {
    // return cyRequest<LoginSuccessInfo>(() => request(`${baseUrl.project}/Manage/SignIn`,{method: "POST", data: params}));
    return request<LoginSuccessInfo>(`${baseUrl.project}/Manage/SignIn`,{method: "POST", data: params});
}

export interface PhoneLoginParams {
    phone: string
    code: string
}

export const phoneLoginRequest = (params: PhoneLoginParams) => {
    return request(`${baseUrl.project}/Manage/SignInByPhone`,{method: "POST", data: params})
}


// 注销登录
export const signOut = () => {
    return cyRequest(() => request(`${baseUrl.project}/Manage/SignOut`, {method: "POST"}))
}

// 图形验证码校验
export const compareVerifyCode = (key: string, code: string) => {
    return request(`${baseUrl.common}/VerifyCode/Compare`, { method: "POST", data: {key, code} })
} 
