export default {
  email: [
    { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '邮箱格式不正确' },
  ],
  nickName: [{ max: 12, message: '昵称超出字符数限制，限制为12个字符' }],

  name: [
    { required: true, message: '真实姓名不能为空' },
    { max: 12, message: '真实姓名超出字符数限制，限制为12个字符' },
  ],
};
