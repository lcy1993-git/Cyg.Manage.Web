export default {
  required: [{ required: true, message: '该值不能为空' }],
  name: [
    { required: true, message: '工程名称不能为空' },
    {
      pattern: /^[^\\^/:*?？！!@￥"<>|;；：'‘’“”、=\^\s]+$/,
      message: '工程名不能包含/:*?"<>|空格等字符',
    },
    {
      max: 64,
      message: '工程名不能超过64个字符',
    },
  ],
  compiler: [
    { required: true, message: '编制人不能为空' },
    { max: 32, message: '此项不能超过32个字符' },
  ],
  organization: [
    { required: true, message: '编制单位不能为空' },
    { max: 32, message: '此项不能超过32个字符' },
  ],
};
