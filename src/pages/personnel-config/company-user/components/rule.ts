export default {
  qtyNumber: [
    { required: true, message: '生产数量不能为0' },
    {
      pattern: /^[0-9]\d*$/,
      message: '请填写1~50以内的整数',
    },
  ],
  pwd: [
    { required: true, message: '密码不能为空', max: 16 },
    {
      min: 6,
      message: '密码不能少于6个字符',
    },
  ],
  confirmPwd: [{ required: true, message: '请确认密码', max: 16 }],
  email: [
    {
      maxLength: 32,
      pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      message: '请输入正确的邮箱格式',
    },
  ],
  nickName: [{ max: 12, message: '昵称超出字符数限制，限制为12个字符' }],
  realName: [{ max: 15, message: '真实姓名超出字符数限制，限制为15个字符' }],
};
