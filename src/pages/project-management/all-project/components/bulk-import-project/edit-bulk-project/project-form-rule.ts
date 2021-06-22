export default {
  required: [{ required: true, message: '该值不能为空' }],
  name: [
    { required: true, message: '项目名称不能为空' },
    {
      pattern: /^[^\\^/:*?"<>|;'、=]+$/,
      message: '项目名不能包含/:*?"<>|等字符',
    },
  ],
};
