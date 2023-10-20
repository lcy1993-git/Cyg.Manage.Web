export default {
  userName: [
    { required: true, message: '用户名不能为空' },
    {
      max: 16,
      message: '请输入16位数字和英文字母',
      pattern: /^[0-9a-zA-Z_]{1,}$/,
    },
  ],

  pwd: [
    { required: true, message: '密码不能为空' },
    {
      pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9@#$%^&*+=!]{8,20}$/,
      message: '密码必须由(8-20)位数字和大小写字母组成（可包含特殊字符）',
    },
  ],
  userType: [{ required: true, message: '请选择账号类型' }],
  adminCategory: [{ required: true, message: '请选择类别' }],
  company: [{ required: true, message: '请选择公司' }],
  email: [
    {
      maxLength: 32,
      pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      message: '请输入正确的邮箱格式',
    },
  ],
  phone: [
    {
      pattern: /^1[23456789][0-9]{9}$/,
      message: '请输入正确的手机号码',
    },
  ],
}
