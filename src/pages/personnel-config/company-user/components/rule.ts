export default {
  qtyNumber: [{ required: true, message: '生产数量不能为0' }],
  pwd: [
    { required: true, message: '密码不能为空', max: 16 },
    {
      min: 6,
      message: '密码不能少于6个字符',
    },
  ],
  confirmPwd: [{ required: true, message: '请确认密码', max: 16 }],
  email: [{ maxLength: 32, pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ }],
};
