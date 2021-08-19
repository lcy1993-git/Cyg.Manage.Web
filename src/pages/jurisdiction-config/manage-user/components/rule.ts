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
    { required: true, message: '密码不能为空', max: 16 },
    {
      min: 6,
      message: '密码不能少于6个字符',
    },
  ],
  role: [{ required: true, message: '请选择角色' }],
  province: [{ required: true, message: '请选择省份' }],
  email: [{ maxLength: 32, pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ }],
};
