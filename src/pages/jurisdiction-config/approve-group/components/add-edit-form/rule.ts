export default {
  name: [
    { required: true, message: '名称不能为空' },
    { max: 12, message: '名称超出字符数限制，限制为12个字符' },
  ],
  userId: [{ required: true, message: '审批责任人不能为空' }],
}
