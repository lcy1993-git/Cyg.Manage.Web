// export type ElementType = '户表箱' | '环网箱' | '电缆沟(电缆通道)' | '排管' | '直线电缆井' | '直线水泥杆塔' | 'NJ1转角杆' | '终端杆' | '单杆设备' | '柱上变压器' | '故障指示器';

const mapRouter = new Map<string, string>()

// 故障指示器,
mapRouter.set('1', 'electricmeter')
// 终端杆,
mapRouter.set('2', 'cabledevice-hwx')
// 直线杆,
mapRouter.set('3', 'cablechannel-gcps')
// 变压器,
mapRouter.set('4', 'cablechannel-pgps')
// 户表,
mapRouter.set('5', 'cable-zx')
// NJ1转角杆,
mapRouter.set('6', 'tower-zxsn')
// 杆上设备,
mapRouter.set('7', 'Tower-nj1')
// 电缆通道, 排管4*5混凝土包封
mapRouter.set('8', 'tower-zd')
// 电缆井,
mapRouter.set('9', 'overheaddevice-dg')
// 电缆通道, 3*350mm单侧支架砖砌电缆沟
mapRouter.set('10', 'transformer')
// 环网箱,
mapRouter.set('11', 'faultindicator-overhead ')

const getThreeModeRouter = (e: string) => {
  return mapRouter.get(e)
}

export default getThreeModeRouter
