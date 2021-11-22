const dataSource = {
  equipments: [
    {
      id: '0004',
      name: '点位1',
      type: '无类型',
      lng: 11328288.300262434,
      lat: 3791136.272883413,
      remark: '1',
    },
    {
      id: '0005',
      name: '点位2',
      type: '开闭所',
      lng: 12309551.553392634,
      lat: 4280473.356898209,
      remark: '2',
    },
    {
      id: '0006',
      name: '321',
      type: '',
      lng: 11607909.491128031,
      lat: 3459733.380005667,
      remark: '',
    },
    {
      id: '0007',
      name: '111',
      type: '开闭所',
      lng: 12607909.491128031,
      lat: 3459733.380005667,
      remark: '222',
    },
    {
      id: '0007',
      name: 'cbec1ac21cbb6',
      type: '分支箱',
      lng: 12757463.275797712,
      lat: 3612489.4009415032,
      remark: '4',
    },
    {
      id: '0008',
      name: '4f96fd4fbbb35',
      type: '配变',
      lng: 11947079.6393076,
      lat: 3229304.80605161,
      remark: '5',
    },
    {
      id: '110',
      name: '',
      type: '',
      lng: 10547079.6393076,
      lat: 3229304.80605161,
      remark: '5',
    },
  ],
  lines: [
    {
      id: '0000',
      name: '线段1',
      type: '无类型',
      startLng: 11328288.300262434,
      startLat: 3791136.272883413,
      endLng: 12309551.553392634,
      endLat: 4280473.356898209,
      remark: '',
      startId: '',
      endId: '',
    },
    {
      id: '0001',
      name: '线段2',
      type: '架空线',
      startLng: 12309551.553392634,
      startLat: 4280473.356898209,
      endLng: 11607909.491128031,
      endLat: 3459733.380005667,
      remark: '',
      startId: '',
      endId: '',
    },
    {
      id: '0002',
      name: '线段33333333333333333333333333333333333333333333333333333333333',
      type: '电缆',
      startLng: 11607909.491128031,
      startLat: 3459733.380005667,
      endLng: 12757463.275797712,
      endLat: 3612489.4009415032,
      remark: '',
      startId: '',
      endId: '',
    },
    {
      id: '0003',
      name:
        '金卡撒旦记录卡撒旦就奥斯卡大奖卡拉圣诞节爱啊实打实打算大苏打睡觉的爱哭的金卡圣诞节卡拉觉得可拉斯基的',
      type: '无类型',
      startLng: 12757463.275797712,
      startLat: 3612489.4009415032,
      endLng: 11947079.6393076,
      endLat: 3229304.80605161,
      remark: '',
      startId: '',
      endId: '',
    },
  ],
}

const designSource = {
  equipments: [
    {
      id: '00014',
      name: '设计点位1',
      type: '无类型',
      lng: 11428288.308262434,
      lat: 3791136.272883413,
      remark: '',
    },
  ],
  lines: [
    {
      id: '00011',
      name: '设计线段1',
      type: '无类型',
      startLng: 11428288.308262434,
      startLat: 3591136.202883413,
      endLng: 12309551.553392634,
      endLat: 4280473.356898209,
      remark: '',
      startId: '',
      endId: '',
    },
  ],
}

export default dataSource

const getData = () => {
  return new Promise((res) => {
    setTimeout(() => {
      res(dataSource)
    }, 1.5)
  })
}

export { getData, designSource }
