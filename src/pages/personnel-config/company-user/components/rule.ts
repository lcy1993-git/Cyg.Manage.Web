export default {
  qtyNumber: [{ required: true, message: '生产数量不能为0' }],
  pwd: [{ required: true, message: '密码不能为空', maxlength: 16, minLength: 6 }],
  confirmPwd: [{ required: true, message: '请确认密码', maxlength: 16, minLength: 6 }],
  email: [{ maxLength: 32, pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ }],
};
