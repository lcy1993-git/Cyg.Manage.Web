export default {
  email: [
    { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '邮箱格式不正确' },
  ],

  name: [
    { required: true, message: '姓名不能为空' },
    { max: 12, message: '姓名超出字符数限制，限制为12个字符' },
  ],
};

export function isRegularCode(code: string) {
  return /^\d{6}$/.test(code)
}