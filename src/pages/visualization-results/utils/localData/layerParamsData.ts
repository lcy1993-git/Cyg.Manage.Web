export interface LayerParams {
  layerName: string; // 下户线
  zIndex: number;
  declutter?: boolean;
  type: 'line' | 'cable_channel' | 'mark' | 'point' | 'pullline';
}

export interface LayerDatas {
  projectID: string;
  time: string;
  data: any
}

export const layerParams: LayerParams[] = [
  {
    layerName: 'user_line', // 下户线
    zIndex: 1,
    declutter: false,
    type: 'line',
  },
  {
    layerName: 'cable_channel', // 电缆通道
    zIndex: 1,
    declutter: false,
    type: 'cable_channel',
  },
  {
    layerName: 'mark', // 地物
    zIndex: 1,
    declutter: false,
    type: 'point',
  },
  {
    layerName: 'line',
    zIndex: 2,
    declutter: false,
    type: 'line'
  },
 
  {
    layerName: 'subline', // 辅助线
    zIndex: 2,
    declutter: false,
    type: 'line',
  },
  {
    layerName: 'electric_meter', // 户表
    zIndex: 2,
    declutter: false,
    type: 'point',
  },
  {
    layerName: 'tower',
    zIndex: 4,
    type: 'point',
  },
  {
    layerName: 'cable',
    zIndex: 3,
    type: 'point',
  },
  {
    layerName: 'transformer', // 变压器
    zIndex: 5,
    declutter: false,
    type: 'point',
  },
  {
    layerName: 'cable_equipment', // 电气设备
    zIndex: 6,
    declutter: false,
    type: 'point',
  },
  {
    layerName: 'cable_head', // 电缆头
    zIndex: 7,
    declutter: false,
    type: 'point',
  },
  {
    layerName: 'cross_arm', // 横担
    zIndex: 8,
    declutter: false,
    type: 'point',
  },
  {
    layerName: 'over_head_device', // 杆上设备
    zIndex: 9,
    declutter: false,
    type: 'point',
  },
  {
    layerName: 'fault_indicator', // 故障指示器
    zIndex: 10,
    declutter: false,
    type: 'point',
  },
];

export const layerDatas: LayerDatas[] = [];