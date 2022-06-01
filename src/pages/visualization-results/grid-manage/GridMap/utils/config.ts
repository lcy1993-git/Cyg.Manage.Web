import {
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
} from '../../DrawToolbar/GridUtils'

const bigSize = 28
const smallSize = 22
const showZoom = 15.5
const textZoom = 17.4
const Configs = [
  {
    name: POWERSUPPLY, // 电源
    size: bigSize,
  },
  {
    name: TRANSFORMERSUBSTATION, // 变电站
    size: 28,
  },
  {
    name: CABLEWELL, // 电缆井
    zoom: showZoom,
    textZoom: textZoom,
    size: smallSize,
  },
  {
    name: TOWER, // 杆塔
    zoom: showZoom,
    textZoom: textZoom,
    size: smallSize,
  },
  {
    name: BOXTRANSFORMER, // 箱变
    zoom: showZoom,
    textZoom: textZoom,
    size: smallSize,
  },
  {
    name: RINGNETWORKCABINET, // 环网柜
    zoom: showZoom,
    textZoom: textZoom,
    size: smallSize,
  },
  {
    name: ELECTRICITYDISTRIBUTIONROOM, // 配电室
    zoom: showZoom,
    textZoom: textZoom,
    size: smallSize,
  },
  {
    name: SWITCHINGSTATION, // 开闭所
    zoom: showZoom,
    textZoom: textZoom,
    size: smallSize,
  },
  {
    name: COLUMNCIRCUITBREAKER, // 柱上断路器
    zoom: showZoom,
    textZoom: textZoom,
    size: smallSize,
  },
  {
    name: COLUMNTRANSFORMER, // 柱上变压器
    zoom: showZoom,
    textZoom: textZoom,
    size: smallSize,
  },
  {
    name: CABLEBRANCHBOX, // 电缆分支箱
    zoom: showZoom,
    textZoom: textZoom,
    size: smallSize,
  },
]
export default Configs
