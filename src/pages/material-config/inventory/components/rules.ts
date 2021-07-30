export default {
  invName: [{ required: true, message: '协议库存名不能为空' }],
  version: [
    { required: true, message: '协议库存版本不能为空' },
    {
      message: '请输入英文或者数字(包含.和_)(版本号不能为0)',
      pattern: /^(?:(?!0$))[0-9a-zA-Z_.]{1,}$/,
    },
    {
      max: 16,
      message: '限制长度为16个字符',
    },
  ],
  province: [{ required: true, message: '请选择区域' }],
  lib: [{ required: true, message: '请选择资源库' }],
  file: [{ required: true, message: '您还未添加导入文件' }],
};
