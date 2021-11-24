export default {
  required: [{ required: true, message: '该值不能为空' }],
  name: [
    { required: true, message: '工程名称不能为空' },
    {
      pattern: /^[^\\^/:*?？！!@￥"<>|;；：'‘’“”、=\^\s]+$/,
      message: '工程名不能包含/\\:*?"<>|空格等字符',
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
  plannedYear: [
    { required: true, message: '计划年度不能为空' },
    { pattern: /^[0-9]\d*$/, message: '请输入正确的年份' },
  ],
  area: [{ required: true, message: '区域不能为空' }],
  lib: [{ required: true, message: '资源库不能为空' }],
  inventory: [{ required: true, message: '协议库存不能为空' }],
  warehouse: [{ required: true, message: '利旧库存协议不能为空' }],
  complieTime: [{ required: true, message: '编制时间不能为空' }],
  company: [{ required: true, message: '所属公司不能为空' }],
  importance: [{ required: true, message: '重要程度不能为空' }],
  grade: [{ required: true, message: '项目级别不能为空' }],
}
