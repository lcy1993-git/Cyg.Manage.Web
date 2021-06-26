export default {
  required: [{ required: true, message: '该值不能为空' }],
  title: [
    { required: true, message: '标题不能为空' },
    {
      pattern: /^[^\\^/:*?？！!@￥"<>|;；：'‘’“”、=\^\s]+$/,
      message: '标题名不能包含/:*?"<>|空格等字符',
    },
    {
      max: 12,
      message: '标题超出字符数限制，限制为12个字符',
    },
  ],
};
