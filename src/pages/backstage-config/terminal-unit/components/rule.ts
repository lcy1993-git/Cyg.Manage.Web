export default {
  serialNumber: [{ required: true, message: '设备号不能为空' }],
  differentialAccount: [{ required: true, message: '账号不能为空' }],
  differentialPwd: [{ required: true, message: '密码不能为空' }],
  expiryTime: [{ required: true, message: '请选择到期时间' }],
}
