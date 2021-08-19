export default {
  name: [
    { required: true, message: '部组名称不能为空' },
    { max: 12, message: '部组名称超出字符数限制，限制为12个字符' },
  ],
  adminUserId: [{ required: true, message: '部组管理员不能为空' }],
};
