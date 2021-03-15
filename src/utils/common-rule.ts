import { RuleObject } from "antd/lib/form";

export const phoneNumberRule = /^[1][3,4,5,7,8,9][0-9]{9}$/;

export const checkHasUploadFile = async (rule: RuleObject, value: any) => {
    if(!value) {
        throw new Error('请上传一个文件!');
    }
    if(value && value.length === 0) {
        throw new Error('请上传一个文件!');
    }
}