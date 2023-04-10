export const getMode = (deviceType: string, feature: any) => {
  let modelName = ''
  switch (deviceType) {
    case 'cable':
      if (feature.type === 1)
        // 直路井
        modelName = 'cable-zx'
      break
    case 'cable_channel':
      if (feature.lay_mode === 2)
        // 排管敷设
        modelName = 'cablechannel-pgps'
      else if (feature.lay_mode === 5)
        // 沟槽敷设
        modelName = 'cablechannel-gcps'
      break
    case 'cable_equipment':
      if (feature.type === 2)
        // 环网箱
        modelName = 'cabledevice-hwx'
      break
    case 'electric_meter': // 户表
      modelName = 'electricmeter'
      break
    case 'fault_indicator': // 故障指示器
      if (feature.is_cable === 0) modelName = 'faultindicator-overhead'
      break
    case 'transformer':
      modelName = 'transformer'
      break
    case 'tower':
      if (feature.kv_level === 3) {
        // 10KV
        if (feature.pole_type_code === 'Z') modelName = 'tower-zxsn'
        // 直线水泥单杆
        else if (feature.pole_type_code === 'D') modelName = 'tower-zd'
        // 终端杆
        else if (feature.pole_type_code === 'NJ1') modelName = 'tower-nj1' // NJ1转角杆
      }
      break
    case 'over_head_device':
      if (feature.type === 3) modelName = 'overheaddevice-dg'
      break
    default:
      break
  }
  return modelName
}
