const kvOptions = { 3: '10kV', 4: '20kV', 5: '35kV', 6: '110kV', 7: '330kV' }

export const lineColumns = [
  {
    title: '电压等级',
    dataIndex: 'kvLevel',
    index: 'kvLevel',
    width: '33.3%',
    render: (text: any, record: any) => {
      return kvOptions[record.kvLevel]
    },
  },

  {
    title: '线路类型',
    dataIndex: 'isOverhead',
    index: 'isOverhead',
    width: '33.3%',
    render: (text: any, record: any) => {
      return record.isOverhead ? '架空线路' : '电缆线路'
    },
  },
  {
    title: '线路型号',
    dataIndex: 'lineModel',
    index: 'lineModel',
    width: '33.3%',
  },
]

export const cableWellColumns = [
  {
    title: '名称',
    dataIndex: 'name',
    index: 'name',
    width: '33.3%',
  },
  {
    title: '电压等级',
    dataIndex: 'kvLevel',
    index: 'kvLevel',
    width: '33.3%',
    render: (text: any, record: any) => {
      return kvOptions[record.kvLevel]
    },
  },
  {
    title: '经纬度',
    dataIndex: 'geom',
    index: 'geom',
    width: '33.3%',
    render: (text: any, record: any) => {
      return record.geom.slice(6).replace(' ', ' ，')
    },
  },
]

export const towerColumns = [
  {
    title: '名称',
    dataIndex: 'name',
    index: 'name',
    width: 200,
  },
  {
    title: '电压等级',
    dataIndex: 'kvLevel',
    index: 'kvLevel',
    width: 150,
    render: (text: any, record: any) => {
      return kvOptions[record.kvLevel]
    },
  },
  {
    title: '杆塔规格',
    dataIndex: 'towerSpecification',
    index: 'towerSpecification',
    width: 160,
  },
  {
    title: '杆塔类型',
    dataIndex: 'towerType',
    index: 'towerType',
    width: 160,
  },
  {
    title: '杆塔材质',
    dataIndex: 'towerMaterial',
    index: 'towerMaterial',
    width: 160,
  },
  {
    title: '经纬度',
    dataIndex: 'geom',
    index: 'geom',
    // width: '33.3%',
    render: (text: any, record: any) => {
      return record.geom.slice(6).replace(' ', ' ，')
    },
  },
]
export const boxTransColumns = [
  {
    title: '名称',
    dataIndex: 'name',
    index: 'name',
    width: 300,
  },
  {
    title: '电压等级',
    dataIndex: 'kvLevel',
    index: 'kvLevel',
    width: 200,
    render: (text: any, record: any) => {
      return kvOptions[record.kvLevel]
    },
  },
  {
    title: '容量',
    dataIndex: 'capacity',
    index: 'capacity',
    width: 180,
  },
  {
    title: '性质',
    dataIndex: 'properties',
    index: 'properties',
    width: 200,
  },

  {
    title: '经纬度',
    dataIndex: 'geom',
    index: 'geom',
    render: (text: any, record: any) => {
      return record.geom.slice(6).replace(' ', ' ，')
    },
  },
]
export const cabinetColumns = [
  {
    title: '名称',
    dataIndex: 'name',
    index: 'name',
    width: 300,
  },
  {
    title: '电压等级',
    dataIndex: 'kvLevel',
    index: 'kvLevel',
    width: 200,
    render: (text: any, record: any) => {
      return kvOptions[record.kvLevel]
    },
  },
  {
    title: '型号',
    dataIndex: 'model',
    index: 'model',
    width: 200,
  },
  {
    title: '性质',
    dataIndex: 'properties',
    index: 'properties',
    width: 200,
  },

  {
    title: '经纬度',
    dataIndex: 'geom',
    index: 'geom',
    render: (text: any, record: any) => {
      return record.geom.slice(6).replace(' ', ' ，')
    },
  },
]
export const elecRoomColumns = [
  {
    title: '名称',
    dataIndex: 'name',
    index: 'name',
    width: 300,
  },
  {
    title: '电压等级',
    dataIndex: 'kvLevel',
    index: 'kvLevel',
    width: 200,
    render: (text: any, record: any) => {
      return kvOptions[record.kvLevel]
    },
  },
  {
    title: '容量',
    dataIndex: 'capacity',
    index: 'capacity',
    width: 180,
  },
  {
    title: '性质',
    dataIndex: 'properties',
    index: 'properties',
    width: 200,
  },

  {
    title: '经纬度',
    dataIndex: 'geom',
    index: 'geom',
    render: (text: any, record: any) => {
      return record.geom.slice(6).replace(' ', ' ，')
    },
  },
]
export const switchColumns = [
  {
    title: '名称',
    dataIndex: 'name',
    index: 'name',
    width: '33.3%',
  },
  {
    title: '电压等级',
    dataIndex: 'kvLevel',
    index: 'kvLevel',
    width: '33.3%',
    render: (text: any, record: any) => {
      return kvOptions[record.kvLevel]
    },
  },
  {
    title: '经纬度',
    dataIndex: 'geom',
    index: 'geom',
    width: '33.3%',
    render: (text: any, record: any) => {
      return record.geom.slice(6).replace(' ', ' ，')
    },
  },
]
export const breakerColumns = [
  {
    title: '名称',
    dataIndex: 'name',
    index: 'name',
    width: '33.3%',
  },
  {
    title: '电压等级',
    dataIndex: 'kvLevel',
    index: 'kvLevel',
    width: '33.3%',
    render: (text: any, record: any) => {
      return kvOptions[record.kvLevel]
    },
  },
  {
    title: '经纬度',
    dataIndex: 'geom',
    index: 'geom',
    width: '33.3%',
    render: (text: any, record: any) => {
      return record.geom.slice(6).replace(' ', ' ，')
    },
  },
]
export const columnTransColumns = [
  {
    title: '名称',
    dataIndex: 'name',
    index: 'name',
    width: 300,
  },
  {
    title: '电压等级',
    dataIndex: 'kvLevel',
    index: 'kvLevel',
    width: 200,
    render: (text: any, record: any) => {
      return kvOptions[record.kvLevel]
    },
  },
  {
    title: '容量',
    dataIndex: 'capacity',
    index: 'capacity',
    width: 180,
  },
  {
    title: '性质',
    dataIndex: 'properties',
    index: 'properties',
    width: 200,
  },

  {
    title: '经纬度',
    dataIndex: 'geom',
    index: 'geom',
    render: (text: any, record: any) => {
      return record.geom.slice(6).replace(' ', ' ，')
    },
  },
]
export const cableBoxColumns = [
  {
    title: '名称',
    dataIndex: 'name',
    index: 'name',
    width: '33.3%',
  },
  {
    title: '电压等级',
    dataIndex: 'kvLevel',
    index: 'kvLevel',
    width: '33.3%',
    render: (text: any, record: any) => {
      return kvOptions[record.kvLevel]
    },
  },
  {
    title: '经纬度',
    dataIndex: 'geom',
    index: 'geom',
    width: '33.3%',
    render: (text: any, record: any) => {
      return record.geom.slice(6).replace(' ', ' ，')
    },
  },
]
