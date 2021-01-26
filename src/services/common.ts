import {RequestDataType} from "./common.d";
import {requestBaseUrl} from "../../public/config/request";
import {message} from "antd";

const {NODE_ENV} = process.env;

export const baseUrl = NODE_ENV === "development" ? "/api" : requestBaseUrl;

export const cyRequest = <T extends {}>(func: () => Promise<RequestDataType<T>>): Promise<T> => {
    return new Promise(async (resolve, reject) => {
        const res = await func();
        
        const {code,content,isSuccess} = res;
        if(isSuccess && code === 200) {
            resolve(content)
        }else {
            message.error(res.message)
            reject(res.message)
        }
    })
}



