export default {
  required: [{ required: true, message: '该值不能为空' }],
  wordsLimit: [{ max: 32, message: '此项不能超过32个字符' }],
  name: [
    { required: true, message: '项目名称不能为空' },
    {
      pattern: /^[^\\^/:*?？！!@￥"<>|;；：'‘’“”、=\^\s]+$/,
      message: '项目名不能包含/\\:*?"<>|空格等字符',
    },
    {
      max: 64,
      message: '项目名不能超过64个字符',
    },
  ],

  total: [
    {
      pattern: /^(([1-9]\d+)|[0-9])/, //匹配正整数
      message: '该项不能为负数',
    },
    {
      pattern: /^([\-]?[0-9]+[\d]*(.[0-9]{1,3})?)$/, //匹配小数位数
      message: '最多保留三位小数',
    },
  ],
  assetsOrganization: [
    { required: true, message: '资产所属单位不能为空' },
    {
      max: 32,
      message: '此项不能超过32个字符',
    },
  ],
  natures: [{ required: true, message: '项目性质不能为空' }],
  assetsNature: [{ required: true, message: '资产性质不能为空' }],
  powerSupply: [{ required: true, message: '供电所/班组不能为空' }],
};
