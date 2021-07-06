import {phoneNumberRule} from "@/utils/common-rule"

export const loginRules = {
    "account": {
        account: [
            {
                required: true, message: "请输入用户名"
            }
        ],
        password: [
            {
                required: true, message: "请输入密码"
            }
        ],
        phone: [
            {
                required: false
            }
        ],
        verificationCode: [
            {
                required: false
            }
        ],
    },
    "phone": {
        account: [
            {
                required: false,
            }
        ],
        password: [
            {
                required: false,
            }
        ],
        phone: [
            {
                validator: async (rule, value) => {
                    if(!value) {
                        throw new Error('请输入手机号');
                    }
                    if(!(phoneNumberRule.test(value))) {
                        throw new Error('手机号格式不符合规范');
                    }
                  } 
            }
        ],
        verificationCode: [
            {
                required: true, message: "请输入验证码"
            }
        ],
    }
}