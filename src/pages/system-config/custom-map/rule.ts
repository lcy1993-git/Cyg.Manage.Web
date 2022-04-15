export default {
  name: [
    { required: true, message: '地图源名称不能为空' },
    { max: 20, message: '地图源名称不能超过20个字符' },
  ],
  url: [{ required: true, message: '地址不能为空' }],
}
