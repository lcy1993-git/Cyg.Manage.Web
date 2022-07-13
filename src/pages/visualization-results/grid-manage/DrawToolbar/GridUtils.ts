/** 箱变 **/
export const BOXTRANSFORMER = 'BoxTransformer'

/** 电缆分支箱 */
export const CABLEBRANCHBOX = 'CableBranchBox'

/** 电缆井 */
export const CABLEWELL = 'CableWell'

/** 柱上断路器 */
export const COLUMNCIRCUITBREAKER = 'ColumnCircuitBreaker'

/** 柱上变压器 */
export const COLUMNTRANSFORMER = 'ColumnTransformer'

/** 配电室 */
export const ELECTRICITYDISTRIBUTIONROOM = 'ElectricityDistributionRoom'

/** 电源 */
export const POWERSUPPLY = 'PowerSupply'

/** 环网柜 */
export const RINGNETWORKCABINET = 'RingNetworkCabinet'

/** 开闭所 */
export const SWITCHINGSTATION = 'SwitchingStation'

/** 杆塔 */
export const TOWER = 'Tower'

/** 变电站 */
export const TRANSFORMERSUBSTATION = 'TransformerSubstation'

/** 电缆线路路 */
export const CABLECIRCUIT = 'CableCircuit'

/** 架空线路 */
export const LINE = 'Line'

export const POINTS = [
  BOXTRANSFORMER,
  CABLEBRANCHBOX,
  CABLEWELL,
  COLUMNCIRCUITBREAKER,
  COLUMNTRANSFORMER,
  ELECTRICITYDISTRIBUTIONROOM,
  POWERSUPPLY,
  RINGNETWORKCABINET,
  SWITCHINGSTATION,
  TOWER,
  TRANSFORMERSUBSTATION,
]

export const TYPENUMS = {
  [TRANSFORMERSUBSTATION]: 1,
  [POWERSUPPLY]: 2,
  [LINE]: 3,
  [TOWER]: 4,
  [BOXTRANSFORMER]: 5,
  [CABLEBRANCHBOX]: 6,
  [CABLEWELL]: 7,
  [COLUMNCIRCUITBREAKER]: 8,
  [COLUMNTRANSFORMER]: 9,
  [ELECTRICITYDISTRIBUTIONROOM]: 10,
  [RINGNETWORKCABINET]: 11,
  [SWITCHINGSTATION]: 12,
}

export const LINES = [LINE, CABLECIRCUIT]

/** 要素类型 */
export const FEATUERTYPE = {
  [POWERSUPPLY]: '电源',
  [TRANSFORMERSUBSTATION]: '变电站',
  [CABLEWELL]: '电缆井',
  [TOWER]: '杆塔',
  [BOXTRANSFORMER]: '箱变',
  [RINGNETWORKCABINET]: '环网柜',
  [ELECTRICITYDISTRIBUTIONROOM]: '配电室',
  [SWITCHINGSTATION]: '开闭所',
  [COLUMNCIRCUITBREAKER]: '柱上断路器',
  [COLUMNTRANSFORMER]: '柱上变压器',
  [CABLEBRANCHBOX]: '电缆分支箱',
  [CABLECIRCUIT]: '线路段',
  [LINE]: '线路段',
}

/** 可以绘制的图元 */
export const FEATUREOPTIONS = [
  { label: '电源', value: POWERSUPPLY },
  { label: '变电站', value: TRANSFORMERSUBSTATION },
  { label: '电缆井', value: CABLEWELL },
  { label: '杆塔', value: TOWER },
  { label: '箱变', value: BOXTRANSFORMER },
  { label: '环网柜', value: RINGNETWORKCABINET },
  { label: '配电室', value: ELECTRICITYDISTRIBUTIONROOM },
  { label: '开闭所', value: SWITCHINGSTATION },
  { label: '柱上断路器', value: COLUMNCIRCUITBREAKER },
  { label: '柱上变压器', value: COLUMNTRANSFORMER },
  { label: '电缆分支箱', value: CABLEBRANCHBOX },
]

export type KVLEVELTYPES = {
  kvLevel: number
  label: string
  belonging: string[]
}

export const COLORDEFAULT = '#000000'

/** 电压等级 */
export const KVLEVELOPTIONS = [
  {
    kvLevel: 3,
    label: '10kV',
    belonging: [
      POWERSUPPLY,
      TOWER,
      COLUMNCIRCUITBREAKER,
      COLUMNTRANSFORMER,
      CABLEWELL,
      BOXTRANSFORMER,
      ELECTRICITYDISTRIBUTIONROOM,
      RINGNETWORKCABINET,
      SWITCHINGSTATION,
      CABLEBRANCHBOX,
      LINE,
    ],
    color: [
      {
        label: '青',
        value: '#00FFFF',
      },
      {
        label: '蓝',
        value: '#1EB9FF',
      },
      {
        label: '黄',
        value: '#F2DA00',
      },
      {
        label: '红',
        value: '#FF3E3E',
      },
      {
        label: '洋红',
        value: '#FF5ECF',
      },
    ],
  },
  {
    kvLevel: 4,
    label: '20kV',
    color: [
      {
        label: '浅黄',
        value: '#FFFFE0',
      },
    ],
    belonging: [TRANSFORMERSUBSTATION, TOWER, CABLEWELL, LINE],
  },
  {
    kvLevel: 5,
    label: '35kV',
    color: [
      {
        label: '浅黄',
        value: '#FFFFE0',
      },
    ],
    belonging: [TRANSFORMERSUBSTATION, POWERSUPPLY, TOWER, CABLEWELL, LINE],
  },
  {
    kvLevel: 6,
    color: [
      {
        label: '咖啡',
        value: '#4D3900',
      },
    ],
    label: '110kV',
    belonging: [TRANSFORMERSUBSTATION, POWERSUPPLY, TOWER, CABLEWELL, LINE],
  },
  {
    kvLevel: 7,
    color: [
      {
        label: '绿',
        value: '#00FF00',
      },
    ],
    label: '330kV',
    belonging: [TRANSFORMERSUBSTATION],
  },
]

export const COLORU = [
  {
    label: '青',
    value: '#00FFFF',
  },
  {
    label: '蓝',
    value: '#1EB9FF',
  },
  {
    label: '黄',
    value: '#F2DA00',
  },
  {
    label: '红',
    value: '#FF3E3E',
  },
  {
    label: '洋红',
    value: '#FF5ECF',
  },
  {
    label: '浅黄',
    value: '#FFFFE0',
  },
  {
    label: '咖啡',
    value: '#4D3900',
  },
  {
    label: '绿',
    value: '#00FF00',
  },
]

/** 要素属性是否在表单中展示所属线路 **/
export const BELONGINGLINE = [
  TOWER,
  COLUMNCIRCUITBREAKER,
  COLUMNTRANSFORMER,
  CABLEWELL,
  BOXTRANSFORMER,
  RINGNETWORKCABINET,
  ELECTRICITYDISTRIBUTIONROOM,
  SWITCHINGSTATION,
  CABLEBRANCHBOX,
  CABLECIRCUIT,
  LINE,
]

/** 存储数据 **/
export const ALLFEATRUETYPE = [...BELONGINGLINE, POWERSUPPLY, TRANSFORMERSUBSTATION]

/** 要素属性是否在表单中展示型号 **/
export const BELONGINGMODEL = [RINGNETWORKCABINET]
/** 要素属性是否在表单中展示配变性值 **/
export const BELONGINGPROPERITIES = [COLUMNTRANSFORMER, BOXTRANSFORMER, ELECTRICITYDISTRIBUTIONROOM]
/** 要素属性是否在表单中展示容量 **/
export const BELONGINGCAPACITY = [COLUMNTRANSFORMER, BOXTRANSFORMER, ELECTRICITYDISTRIBUTIONROOM]

/** 架空线路型号 **/
export const LINEMODEL = [
  { label: '绝缘线，50', value: '绝缘线，50' },
  { label: '绝缘线，70', value: '绝缘线，70' },
  { label: '绝缘线，95', value: '绝缘线，95' },
  { label: '绝缘线，120', value: '绝缘线，120' },
  { label: '绝缘线，150', value: '绝缘线，150' },
  { label: '绝缘线，185', value: '绝缘线，185' },
  { label: '绝缘线，240', value: '绝缘线，240' },
  { label: '钢芯铝绞线，50/8', value: '钢芯铝绞线，50/8' },
  { label: '钢芯铝绞线，70/10', value: '钢芯铝绞线，70/10' },
  { label: '钢芯铝绞线，95/15', value: '钢芯铝绞线，95/15' },
  { label: '钢芯铝绞线，120/20', value: '钢芯铝绞线，120/20' },
  { label: '钢芯铝绞线，150/20', value: '钢芯铝绞线，150/20' },
  { label: '钢芯铝绞线，185/25', value: '钢芯铝绞线，185/25' },
  { label: '钢芯铝绞线，240/30', value: '钢芯铝绞线，240/30' },
]

/** 电缆线路型号 */
export const CABLECIRCUITMODEL = [
  { label: '电力电缆，70', value: '电力电缆，70' },
  { label: '电力电缆，120', value: '电力电缆，120' },
  { label: '电力电缆，240', value: '电力电缆，240' },
  { label: '电力电缆，300', value: '电力电缆，300' },
  { label: '电力电缆，400', value: '电力电缆，400' },
]

export const createFeatureId = () => {
  const s = []
  const hexDigits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr(0x3 | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '_'

  var uuid = s.join('')
  return uuid
}

//获取对应设备项目的电压等级项
export const getKeyword = (clickTab: string) => {
  switch (clickTab) {
    case 'mainLine':
      return 'Line'
    case 'subStations':
      return 'TransformerSubstation'
    case 'power':
      return 'PowerSupply'
    case 'cableWell':
      return 'CableWell'
    case 'boxTrans':
      return 'BoxTransformer'
    case 'cabinet':
      return 'RingNetworkCabinet'
    case 'elecRoom':
      return 'ElectricityDistributionRoom'
    case 'switchStation':
      return 'SwitchingStation'
    case 'breaker':
      return 'ColumnCircuitBreaker'
    case 'columnTrans':
      return 'ColumnTransformer'
    case 'cableBox':
      return 'CableBranchBox'
    case 'tower':
      return 'Tower'
    default:
      return ''
  }
}

export const handleKvOptions = (clickTab: string) => {
  return [
    ...KVLEVELOPTIONS.filter((item: KVLEVELTYPES) =>
      item.belonging.find((type: string) => type.includes(getKeyword(clickTab)))
    ),
  ]
}
