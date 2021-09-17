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
      pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=([\x21-\x7e]+)[^a-zA-Z0-9])(.{8,15})$/,
      message: '密码应由数字、字母、特殊字符组成的长度为8-15位字符',
    },
  ],
  userType: [{ required: true, message: '请选择账号类型' }],
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
};
