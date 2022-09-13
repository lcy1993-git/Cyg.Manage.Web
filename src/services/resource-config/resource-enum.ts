export enum materialType {
  '材料' = '材料',
  '设备' = '设备',
}

export enum supplySideType {
  '甲供' = '甲供',
  '乙供' = '乙供',
}

export enum kvLevelType {
  '不限' = '不限',
  '10kV' = '10kV',
  '220V' = '220V',
  '380V' = '380V',
}

export enum kvBothLevelType {
  '不限' = '不限',
  '10kV' = '10kV',
  '220V' = '220V',
  '380V' = '380V',
  '380V、220V' = '380V、220V',
}
export enum forProjectType {
  '不限' = '不限',
  '城网' = '城网',
  '农网' = '农网',
}
export enum forDesignType {
  '不限' = '不限',
  '架空' = '架空',
  '电缆' = '电缆',
}

export enum deviceCategoryType {
  '杆上组件' = '杆上组件',
  '电气设备' = '电气设备',
  '变压器' = '变压器',
  '下户' = '下户',
  '横担' = '横担',
  '拉线' = '拉线',
  '特殊杆型' = '特殊杆型',
  '绝缘子' = '绝缘子',
  '其他' = '其他',
}

export enum poleType {
  '架空' = '架空',
  '电缆' = '电缆',
  '组件' = '组件',
}

export enum poleMaterial {
  '水泥单杆' = '水泥单杆',
  '水泥双杆' = '水泥双杆',
  '方杆' = '方杆',
  '钢管杆' = '钢管杆',
  '窄基塔' = '窄基塔',
}

export enum loopNumber {
  '单回路' = '单回路',
  '双回路' = '双回路',
  '三回路' = '三回路',
  '四回路' = '四回路',
}

export enum poleKvLevel {
  '10kV' = '10kV',
  '220V' = '220V',
  '380V' = '380V',
}

export enum segment {
  '不分段' = '不分段',
  '法兰' = '法兰',
  '电焊' = '电焊',
  '气焊' = '气焊',
  '螺栓' = '螺栓',
  '三角' = '三角',
  '水平' = '水平',
  '双垂直' = '双垂直',
  '双水平' = '双水平',
  '上双三角下单水平' = '上双三角下单水平',
  '上双垂直下单水平' = '上双垂直下单水平',
  '上双三角下双三角' = '上双三角下双三角',
  '上双垂直下双垂直' = '上双垂直下双垂直',
}

export enum arrangement {
  '三角' = '三角',
  '水平' = '水平',
  '双水平' = '双水平',
  '双垂直' = '双垂直',
  '双三角' = '双三角',
  '上单三角下单水平' = '上单三角下单水平',
  '其他' = '其他',
}

export enum meteorologic {
  'A类' = 'A类',
  'B类' = 'B类',
  'C类' = 'C类',
}

export enum feature {
  '工作井' = '工作井',
  '检查井' = '检查井',
  '普通井' = '普通井',
  '中间头井' = '中间头井',
}
export enum coverMode {
  '人孔' = '人孔',
  '全开启' = '全开启',
}

export enum grooveStructure {
  '砖彻' = '砖彻',
  '钢筋混凝土' = '钢筋混凝土',
}
// 资源库电气设备类型枚举
export enum electricalEquipmentComponentType {
  '开关站' = '开关站',
  '环网室' = '环网室',
  '配电室' = '配电室',
  '箱式变电站' = '箱式变电站',
  '高压分支箱' = '高压分支箱',
  '低压分支箱' = '低压分支箱',
  '变电站' = '变电站',
  '其他' = '其他',
}
// 图纸类别
export enum drawingCategory {
  '物料' = '物料',
  '组件' = '组件',
  '电缆' = '电缆',
  '架空' = '架空',
}
// 图纸类型
export enum drawingType {
  '加工图' = '加工图',
  '设计图' = '设计图',
  '杆型一览图' = '杆型一览图',
}
