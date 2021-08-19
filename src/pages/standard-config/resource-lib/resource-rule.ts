export default {
  name: [
    { required: true, message: '资源库名称不能为空' },
    {
      pattern: /^[^\\^/:*?？！!@￥"<>|;；：'‘’“”、=\^\s]+$/,
      message: '资源库名称不能包含/\\:*?"<>|空格等字符',
    },
    {
      max: 12,
      message: '资源库名称超出字符数限制，限制为12个字符',
    },
  ],
  version: [{ max: 12, message: '版本超出字符数限制，限制为12个字符' }],
};
