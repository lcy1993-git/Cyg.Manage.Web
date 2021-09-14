export default {
  pwd: [
    { required: true, message: '密码不能为空' },
    {
      pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=([\x21-\x7e]+)[^a-zA-Z0-9])(.{8,15})$/,
      message: '密码应由数字、字母、特殊字符组成的长度为8-15位字符',
    },
  ],
  email: [
    {
      pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      message: '请输入正确的邮箱格式',
    },
  ],
  nickName: [{ max: 12, message: '昵称超出字符数限制，限制为12个字符' }],
  realName: [
    { required: true, message: '真实姓名不能为空' },
    { max: 12, message: '真实姓名超出字符数限制，限制为12个字符' },
  ],
  idNumber: [
    { required: true, message: '身份证号不能为空' },
    {
      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      message: '请输入正确的身份证格式',
    },
  ],
};
