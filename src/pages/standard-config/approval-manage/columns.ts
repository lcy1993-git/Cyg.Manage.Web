export const MaterialColumns = [
  {
    dataIndex: 'Code',
    index: 'Code',
    title: '物资编号',
    width: 220,
  },
  {
    dataIndex: 'Category',
    index: 'Category',
    title: '物料类型',
    width: 180,
  },
  {
    dataIndex: 'MaterialName',
    index: 'MaterialName',
    title: '物料名称',
    width: 320,
  },
  {
    dataIndex: 'Spec',
    index: 'Spec',
    title: '规格型号',
    width: 320,
  },
  {
    dataIndex: 'MaterialType',
    index: 'MaterialType',
    title: '类别',
    width: 180,
  },
  {
    dataIndex: 'Unit',
    index: 'Unit',
    title: '单位',
    width: 140,
  },
  {
    dataIndex: 'PieceWeight',
    index: 'PieceWeight',
    title: '单重(kg)',
    width: 180,
  },

  {
    dataIndex: 'SupplySide',
    index: 'SupplySide',
    title: '供给方',
    width: 150,
  },
  {
    dataIndex: 'TransportationType',
    index: 'TransportationType',
    title: '运输类型',
    width: 240,
  },
  {
    dataIndex: 'KVLevel',
    index: 'KVLevel',
    title: '电压等级',
    width: 160,
  },
]
export const ComponentColumns = [
  {
    dataIndex: 'ComponentName',
    index: 'ComponentName',
    title: '组件名称',
    width: 380,
  },
  {
    dataIndex: 'ComponentSpec',
    index: 'ComponentName',
    title: '组件型号',
    width: 380,
  },
  {
    dataIndex: 'TypicalCode',
    index: 'TypicalCode',
    title: '典设编码',
    width: 220,
  },
  {
    dataIndex: 'Unit',
    index: 'Unit',
    title: '单位',
    width: 120,
  },
  {
    dataIndex: 'DeviceCategory',
    index: 'DeviceCategory',
    title: '设备分类',
    width: 180,
  },
  {
    dataIndex: 'ComponentType',
    index: 'ComponentType',
    title: '组件分类',
    width: 180,
  },

  {
    dataIndex: 'KvLevel',
    index: 'KvLevel',
    title: '电压等级',
    width: 180,
  },
]
export const CategoryColumns = [
  {
    dataIndex: 'PoleTypeCode',
    index: 'PoleTypeCode',
    title: '分类简号',
    width: 180,
  },
  {
    dataIndex: 'PoleTypeName',
    index: 'PoleTypeName',
    title: '分类名称',
    width: 280,
  },
  {
    dataIndex: 'Category',
    index: 'Category',
    title: '类型',
    width: 200,
  },
  {
    dataIndex: 'KvLevel',
    index: 'KvLevel',
    title: '电压等级',
    width: 180,
  },
  {
    dataIndex: 'Type',
    index: 'Type',
    title: '分类类型',
    width: 180,
  },
  {
    dataIndex: 'Corner',
    index: 'Corner',
    title: '转角',
    width: 180,
  },
  {
    dataIndex: 'Material',
    index: 'Material',
    title: '分类材质',
    width: 180,
  },
  {
    dataIndex: 'LoopNumber',
    index: 'LoopNumber',
    title: '回路数',
    width: 180,
  },

  {
    dataIndex: 'IsTension',
    index: 'IsTension',
    title: '是否耐张',
    width: 180,
    render: (text: any, record: any) => {
      return record.isTension == true ? '是' : '否'
    },
  },
]
export const PoleTypeColumns = [
  {
    dataIndex: 'ModuleName',
    index: 'ModuleName',
    title: '杆型名称',
    width: 500,
  },
  {
    dataIndex: 'PoleTypeCode',
    index: 'PoleTypeCode',
    title: '杆型简号',
    width: 280,
  },
  {
    dataIndex: 'TypicalCode',
    index: 'TypicalCode',
    title: '典设编码',
    width: 180,
  },
  {
    dataIndex: 'Unit',
    index: 'Unit',
    title: '单位',
    width: 100,
  },

  {
    dataIndex: 'Height',
    index: 'Height',
    title: '高度（m）',
    width: 200,
  },
  {
    dataIndex: 'Depth',
    index: 'Depth',
    title: '埋深（m）',
    width: 200,
  },
  {
    dataIndex: 'NominalHeight',
    index: 'NominalHeight',
    title: '呼称高（m）',
    width: 200,
  },
  {
    dataIndex: 'RodDiameter',
    index: 'RodDiameter',
    title: '杆梢径（mm）',
    width: 200,
  },
  {
    dataIndex: 'SegmentMode',
    index: 'SegmentMode',
    title: '分段方式',
    width: 200,
  },
  {
    dataIndex: 'Arrangement',
    index: 'Arrangement',
    title: '导线排列方式',
    width: 240,
  },
  {
    dataIndex: 'Meteorologic',
    index: 'Meteorologic',
    title: '气象区',
    width: 200,
  },
  {
    dataIndex: 'LoopNumber',
    index: 'LoopNumber',
    title: '回路数',
    width: 200,
  },
  {
    dataIndex: 'LineNumber',
    index: 'LineNumber',
    title: '线数',
    width: 140,
  },
]
export const CableChannelColumns = [
  {
    dataIndex: 'ChannelName',
    index: 'ChannelName',
    title: '模块名称',
    width: 480,
  },
  {
    dataIndex: 'ShortName',
    index: 'ShortName',
    title: '模块简称',
    width: 260,
  },

  {
    dataIndex: 'ChannelCode',
    index: 'ChannelCode',
    title: '简号',
    width: 320,
  },
  {
    dataIndex: 'TypicalCode',
    index: 'TypicalCode',
    title: '典设编码',
    width: 320,
  },
  {
    dataIndex: 'Unit',
    index: 'Unit',
    title: '单位',
    width: 180,
  },

  {
    dataIndex: 'ReservedWidth',
    index: 'ReservedWidth',
    title: '通道预留宽度(mm)',
    width: 240,
  },

  {
    dataIndex: 'DigDepth',
    index: 'DigDepth',
    title: '挖深',
    width: 180,
  },
  {
    dataIndex: 'LayingMode',
    index: 'LayingMode',
    title: '敷设方式',
    width: 240,
  },
  {
    dataIndex: 'CableNumber',
    index: 'CableNumber',
    title: '可容纳电缆数',
    width: 180,
  },
  {
    dataIndex: 'BracketNumber',
    index: 'BracketNumber',
    title: '支架层数',
    width: 180,
  },

  {
    dataIndex: 'Arrangement',
    index: 'Arrangement',
    title: '排列方式',
    width: 180,
  },
]
export const CableWellColumns = [
  {
    dataIndex: 'Type',
    index: 'Type',
    title: '类型',
    width: 140,
  },
  {
    dataIndex: 'CableWellName',
    index: 'CableWellName',
    title: '模块名称',
    width: 420,
  },
  {
    dataIndex: 'ShortName',
    index: 'ShortName',
    title: '模块简称',
    width: 200,
  },
  {
    dataIndex: 'TypicalCode',
    index: 'TypicalCode',
    title: '典设编码',
    width: 320,
  },
  {
    dataIndex: 'Unit',
    index: 'Unit',
    title: '单位',
    width: 140,
  },
  {
    dataIndex: 'Width',
    index: 'Width',
    title: '宽度(mm)',
    width: 180,
  },

  {
    dataIndex: 'Depth',
    index: 'Depth',
    title: '井深(mm)',
    width: 180,
  },
  {
    dataIndex: 'IsConfined',
    index: 'IsConfined',
    title: '是否封闭',
    width: 140,
    render: (text: any, record: any) => {
      return record.isConfined === 0 ? '否' : '是'
    },
  },
  {
    dataIndex: 'IsSwitchingPipe',
    index: 'IsSwitchingPipe',
    title: '是否转接孔管',
    width: 200,
    render: (text: any, record: any) => {
      return record.isSwitchingPipe === 0 ? '否' : '是'
    },
  },
  {
    dataIndex: 'Feature',
    index: 'Feature',
    title: '特征',
    width: 180,
  },
  {
    dataIndex: 'Pavement',
    index: 'Pavement',
    title: '路面环境',
    width: 200,
  },
  {
    dataIndex: 'Size',
    index: 'Size',
    title: '尺寸',
    width: 180,
  },
  {
    dataIndex: 'CoverMode',
    index: 'CoverMode',
    title: '盖板模式',
    width: 200,
  },
  {
    dataIndex: 'GrooveStructure',
    index: 'GrooveStructure',
    title: '沟体结构',
    width: 200,
  },
]
