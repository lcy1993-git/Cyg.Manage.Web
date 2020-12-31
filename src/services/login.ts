import {request} from "umi";

export interface loginParams {
    UserName: string
    Pwd: string
}

export const loginRequest = (params: loginParams) => {
    return request("/api/Home/SignInAsync",{method: "POST", data: params, requestType: "form"});
}