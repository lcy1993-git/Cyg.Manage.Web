export default {
  name: [
    { required: true, message: '地图源名称不能为空' },
    { max: 20, message: '地图源名称不能超过20个字符' },
  ],
  address: [{ required: true, message: '地址不能为空' }],
  minLevel: [
    { required: true },
    { pattern: /^([0-4]?\d{1}|18)$/g, message: '请输入0-18以内的正整数' },
  ],
  maxLevel: [
    { required: true },
    { pattern: /^([0-4]?\d{1}|18)$/g, message: '请输入0-18以内的正整数' },
  ],
}
