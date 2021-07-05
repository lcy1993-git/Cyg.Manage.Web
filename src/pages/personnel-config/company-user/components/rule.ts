export default {
  pwd: [
    { required: true, message: '密码不能为空' },
    {
      min: 6,
      message: '密码不能少于6个字符',
    },
    {
      max: 20,
      message: '密码不能多于20个字符',
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
    // { required: true, message: '真实姓名不能为空' },
    { max: 12, message: '真实姓名超出字符数限制，限制为12个字符' },
  ],
};
