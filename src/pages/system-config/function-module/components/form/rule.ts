export default {
  name: [{ required: true, message: '模块名称不能为空' }],
  category: [{ required: true, message: '类别不能为空' }],
  authCode: [{ required: true, message: '授权码不能为空' }],
  sort: [{ required: true, message: '排序不能为空' }],
};
