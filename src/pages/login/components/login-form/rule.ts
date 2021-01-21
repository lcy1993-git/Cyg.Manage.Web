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
                required: true, message: "请输入手机号"
            }
        ],
        verificationCode: [
            {
                required: true, message: "请输入验证码"
            }
        ],
    }
}