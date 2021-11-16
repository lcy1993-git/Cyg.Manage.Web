const dataSource = {
  point: [
    {
      id: '0004',
      name: 'b006b1e015283',
      type: '无类型',
      Lng: 11328288.300262434,
      Lat: 3791136.272883413,
      remark: '',
    },
    {
      id: '0005',
      name: '89455838e9ad4',
      type: '开闭所',
      Lng: 12309551.553392634,
      Lat: 4280473.356898209,
      remark: '',
    },
    {
      id: '0006',
      name: '23a74a35c97ed',
      type: '环网柜',
      Lng: 11607909.491128031,
      Lat: 3459733.380005667,
      remark: '',
    },
    {
      id: '0007',
      name: 'cbec1ac21cbb6',
      type: '分支箱',
      Lng: 12757463.275797712,
      Lat: 3612489.4009415032,
      remark: '',
    },
    {
      id: '0008',
      name: '4f96fd4fbbb35',
      type: '配变',
      Lng: 11947079.6393076,
      Lat: 3229304.80605161,
      remark: '',
    },
  ],
  line: [
    {
      id: '0000',
      name: 'de83ac88e1b31',
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
      name: 'a42e96c131e39',
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
      name: '653b703f2cee1',
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
      name: '253775c845e74',
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

export default dataSource

const getData = () => {
  return new Promise((res) => {
    setTimeout(() => {
      res(dataSource)
    }, 1.5)
  })
}

export { getData }
