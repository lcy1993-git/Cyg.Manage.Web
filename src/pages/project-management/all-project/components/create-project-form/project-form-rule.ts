export default {
  required: [{ required: true, message: '该值不能为空' }],
  name: [
    { required: true, message: '项目名称不能为空' },
    {
      pattern: /^[^\\^/:*?"<>|;'、=]+$/,
      message: '项目名不能包含/:*?"<>|等字符',
    },
  ],
  // jdScope: [
  //   { required: true, message: '交底范围不能为空' },
  //   {
  //     pattern: /^[1-9]\d*$/,
  //     message: '请填写1~99999以内的整数',
  //   },
  // ],
  // zwScope: [
  //   { required: true, message: '桩位范围不能为空' },
  //   {
  //     pattern: /^[1-9]\d*$/,
  //     message: '请填写1~99999以内的整数',
  //   },
  // ],
  total: [
    {
      pattern: /^[0-9]\d*$/,
      message: '请输入0或正整数',
    },
  ],
};
