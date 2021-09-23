// export type ElementType = '户表箱' | '环网箱' | '电缆沟(电缆通道)' | '排管' | '直线电缆井' | '直线水泥杆塔' | 'NJ1转角杆' | '终端杆' | '单杆设备' | '柱上变压器' | '故障指示器';

const mapRouter = new Map<string, string>();

mapRouter.set('户表箱', 'electric-meter');
mapRouter.set('环网箱', 'cable-device-hwx');
mapRouter.set('电缆沟(电缆通道)', 'cable-channel');
mapRouter.set('排管', 'hole');
mapRouter.set('直线电缆井', 'cable-zx');
mapRouter.set('直线水泥杆塔', 'Tower-zxsn');
mapRouter.set('NJ1转角杆', 'tower-nj1');
mapRouter.set('终端杆', 'tower-zd');
mapRouter.set('单杆设备', 'over-head-device-dg');
mapRouter.set('柱上变压器', 'over-head-device-zsbyq');
mapRouter.set('故障指示器', 'fault-indicator');

const getThreeModeRouter = (e: string) => {
  return mapRouter.get(e)
}

export default getThreeModeRouter;