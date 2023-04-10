export default {
  pwd: [
    { required: true, message: '密码不能为空' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
      message: '密码必须由(8-20)位数字和大小写字母组成',
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
    { required: true, message: '姓名不能为空' },
    { max: 12, message: '姓名超出字符数限制，限制为12个字符' },
  ],
  idNumber: [
    { required: true, message: '身份证号不能为空' },
    {
      pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      message: '请输入正确的身份证格式',
    },
  ],
}
