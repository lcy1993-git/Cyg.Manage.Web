export default {
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
  users: [{ required: true, message: '对象不能为空' }],
  category: [{ required: true, message: '端口不能为空' }],
};
