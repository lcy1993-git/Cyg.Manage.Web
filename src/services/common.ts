import {RequestDataType} from "./common.d";
import {requestBaseUrl} from "../../public/config/request"

const {NODE_ENV} = process.env;

export const baseUrl = NODE_ENV === "development" ? "/api" : requestBaseUrl;

export const cyRequest = <T extends {}>(func: () => Promise<RequestDataType<T>>): Promise<T> => {
    return new Promise(async (resolve, reject) => {
        const res = await func();
        
        const {code,content,isSuccess,message} = res;
        if(isSuccess && code === 200) {
            resolve(content)
        }else {
            reject(message)
        }
    })
}

