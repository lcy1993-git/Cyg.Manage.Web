const Styles = {
  tower: {
    size: 18,
    fillSize: 24,
    strokeSize: 26,
    color: 'white',
    fillColor: 'rgba(110, 74, 192, 1)',
    strokeColor: 'rgba(5,21,89,0.5)',
    selected: {
      size: 22,
      fillSize: 30,
      strokeSize: 32,
      color: 'white',
      fillColor: 'rgba(249, 149, 52, 1)',
      strokeColor: 'rgba(255, 255, 255, 0.75)',
    },
    empty: {
      size: 26,
      fillSize: 26,
      strokeSize: 26,
      color: 'rgba(254, 36, 36, 1)',
      fillColor: 'rgba(255, 255, 255, 1)',
      strokeColor: 'rgba(255, 255, 255, 0)',
    },
  },
  cable: {
    //电缆井
    size: 18,
    fillSize: 24,
    strokeSize: 26,
    color: 'white',
    fillColor: 'rgba(40, 156, 222, 1)',
    strokeColor: 'rgba(5,21,89,0.5)',
    selected: {
      size: 22,
      fillSize: 30,
      strokeSize: 32,
      color: 'white',
      fillColor: 'rgba(249, 149, 52, 1)',
      strokeColor: 'rgba(255, 255, 255, 0.75)',
    },
    empty: {
      size: 16,
      fillSize: 24,
      strokeSize: 26,
      color: 'white',
      fillColor: 'rgba(221, 64, 27, 1)',
      strokeColor: 'rgba(126, 38, 17, 1)',
    },
  },
  transformer: {
    //变压器
    size: 32,
    fillSize: 38,
    strokeSize: 40,
    color: 'white',
    fillColor: 'rgba(20, 168, 107, 1)',
    strokeColor: 'rgba(16, 43, 38, 0.5)',
    selected: {
      size: 32,
      fillSize: 38,
      strokeSize: 40,
      color: 'white',
      fillColor: 'rgba(249, 149, 52, 1)',
      strokeColor: 'rgba(255, 255, 255, 0.75)',
    },
    empty: {
      size: 32,
      fillSize: 38,
      strokeSize: 40,
      color: 'white',
      fillColor: 'rgba(254, 36, 36, 1)',
      strokeColor: 'rgba(210, 0, 0, 1)',
    },
  },
  //电力设备
  cable_equipment: {
    size: 16,
    fillSize: 24,
    strokeSize: 26,
    color: 'white',
    fillColor: 'rgba(20, 168, 107, 1)',
    strokeColor: 'rgba(16, 43, 38, 0.5)',
    selected: {
      size: 22,
      fillSize: 30,
      strokeSize: 32,
      color: 'white',
      fillColor: 'rgba(249, 149, 52, 1)',
      strokeColor: 'rgba(255, 255, 255, 0.75)',
    },
    empty: {
      size: 16,
      fillSize: 24,
      strokeSize: 26,
      color: 'white',
      fillColor: 'rgba(254, 36, 36, 1)',
      strokeColor: 'rgba(210, 0, 0, 1)',
    },
  },
  //户表
  electric_meter: {
    size: 28,
    fillSize: 38,
    strokeSize: 23,
    color: 'white',
    fillColor: 'rgba(20, 168, 107, 1)',
    strokeColor: 'rgba(16, 43, 38, 0.5)',
    selected: {
      size: 32,
      fillSize: 38,
      strokeSize: 23,
      color: 'white',
      fillColor: 'rgba(249, 149, 52, 1)',
      strokeColor: 'rgba(255, 255, 255, 0.75)',
    },
    empty: {
      size: 32,
      fillSize: 38,
      strokeSize: 23,
      color: 'white',
      fillColor: 'rgba(221, 64, 27, 1)',
      strokeColor: 'rgba(126, 38, 17, 1)',
    },
  },
  cross_arm: {
    //横担
    size: 25,
    fillSize: 30,
    strokeSize: 35,
    color: 'rgba(90, 93, 81, 1)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    fillColor: 'rgba(255, 255, 255, 0)',
    strokeColor: 'rgba(5,21,89,0)',
    selected: {
      size: 27,
      fillSize: 30,
      strokeSize: 35,
      color: 'rgba(249, 149, 52, 1)',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      fillColor: 'rgba(250, 104, 135, 0)',
      strokeColor: 'rgba(255, 255, 255, 0)',
    },
    empty: {
      size: 27,
      fillSize: 30,
      strokeSize: 35,
      color: 'rgba(221, 64, 27, 1)',
      fillColor: 'rgba(255, 255, 255, 0)',
      strokeColor: 'rgba(255, 255, 255, 0)',
    },
  },
  hole: {
    // 穿孔
    size: 25,
    fillSize: 30,
    strokeSize: 35,
    color: 'rgba(90, 93, 81, 1)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    fillColor: 'rgba(255, 255, 255, 0)',
    strokeColor: 'rgba(5,21,89,0)',
    selected: {
      size: 27,
      fillSize: 30,
      strokeSize: 35,
      color: 'rgba(249, 149, 52, 1)',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      fillColor: 'rgba(250, 104, 135, 0)',
      strokeColor: 'rgba(255, 255, 255, 0)',
    },
    empty: {
      size: 27,
      fillSize: 30,
      strokeSize: 35,
      color: 'rgba(221, 64, 27, 1)',
      fillColor: 'rgba(255, 255, 255, 0)',
      strokeColor: 'rgba(255, 255, 255, 0)',
    },
  },
  over_head_device: {
    //杆上物
    size: 18,
    fillSize: 13,
    strokeSize: 15,
    color: 'white',
    fillColor: 'rgba(134, 117, 234, 1)',
    strokeColor: 'rgba(50, 46, 77, 0.5)',
    selected: {
      size: 18,
      fillSize: 14,
      strokeSize: 16,
      color: 'white',
      fillColor: 'rgba(249, 149, 52, 1)',
      strokeColor: 'rgba(255, 255, 255, 0.5)',
    },
    empty: {
      size: 18,
      fillSize: 20,
      strokeSize: 22,
      color: 'white',
      fillColor: 'rgba(254, 36, 36, 1)',
      strokeColor: 'rgba(210, 0, 0, 1)',
    },
  },
  line: {
    '3010': {
      // 电缆通道
      color: 'rgba(58, 46, 70, 1)',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      width: 8,
    },
    '3020': {
      // 电缆通道——拆除
      color: 'rgba(58, 46, 70, 1)',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      width: 8,
      isDismantle: true,
    },
    fzx: {
      color: 'rgba(0,191,255, 0.5)',
      lineDash: true,
      width: 2,
    },
    selected: {
      text1: '\ue887\ue887',
      text2: '\ue887\ue887\ue887\ue887',
      color: 'rgba(249, 149, 52, 1)',
      backgroundColor: 'rgba(0, 0, 64, 0.6)',
      width: 9,
    },
    default: {
      backgroundColor: 'rgba(23, 34, 29, 0.6)',
      width: 6,
    },
    '1011': {
      // 原有220V
      color: 'rgba(145, 145, 255, 1)',
      img: '../images_new/220V电压',
      // lineDash: false
    },
    '1012': {
      // 原有380V
      color: 'rgba(96, 215, 26, 1)',
      img: '../images_new/380V电压',
      // lineDash: false
    },
    '1013': {
      // 原有10kV
      color: 'rgba(0, 255, 216, 1)',
      // lineDash: false
    },
    '1014': {
      // 原有20kV
      color: 'rgba(255, 175, 110, 1)',
      // lineDash: false
    },

    '1021': {
      // 新建220V
      color: 'rgba(145, 145, 255, 1)',
      img: '../images_new/220V电压',
      lineDash: [12],
    },
    '1022': {
      // 新建380V
      color: 'rgba(96, 215, 26, 1)',
      img: '../images_new/380V电压',
      lineDash: [12],
    },
    '1023': {
      // 新建10kV
      color: 'rgba(0, 255, 216, 1)',
      lineDash: [12],
    },
    '1024': {
      // 新建20kV
      color: 'rgba(255, 175, 110, 1)',
      lineDash: [12],
    },

    '1031': {
      // 利旧220V
      color: 'rgba(145, 145, 255, 1)',
      img: '../images_new/220V电压',
      lineDash: [4],
    },
    '1032': {
      // 利旧380V
      color: 'rgba(96, 215, 26, 1)',
      img: '../images_new/380V电压',
      lineDash: [4],
    },
    '1033': {
      // 利旧10kV
      color: 'rgba(0, 255, 216, 1)',
      lineDash: [4],
    },
    '1034': {
      // 利旧20kV
      color: 'rgba(255, 175, 110, 1)',
      lineDash: [4],
    },

    '1041': {
      // 拆除220V
      color: 'rgba(145, 145, 255, 1)',
      img: '../images_new/220V电压',
      isDismantle: true,
    },
    '1042': {
      // 拆除380V
      color: 'rgba(96, 215, 26, 1)',
      img: '../images_new/380V电压',
      isDismantle: true,
    },
    '1043': {
      // 拆除10kV
      color: 'rgba(0, 255, 216, 1)',
      isDismantle: true,
    },
    '1044': {
      // 拆除20kV
      color: 'rgba(255, 175, 110, 1)',
      isDismantle: true,
    },

    '1111': {
      // 原有220V电缆
      color: 'rgba(145, 145, 255, 1)',
    },
    '1112': {
      // 原有380V电缆
      color: 'rgba(103, 220, 34, 1)',
    },
    '1113': {
      // 原有10kV电缆
      color: 'rgba(0, 255, 216, 1)',
    },
    '1114': {
      // 原有20kV电缆
      color: 'rgba(255, 175, 110, 1)',
    },

    '1121': {
      // 新建220V电缆
      color: 'rgba(145, 145, 255, 1)',
      lineDash: [12],
    },
    '1122': {
      // 新建380V电缆
      color: 'rgba(103, 220, 34, 1)',
      lineDash: [12],
    },
    '1123': {
      // 新建10V电缆
      color: 'rgba(0, 255, 216, 1)',
      lineDash: [12],
    },
    '1124': {
      // 新建20V电缆
      color: 'rgba(255, 175, 110, 1)',
      lineDash: [12],
    },

    '1131': {
      // 利旧220V电缆
      color: 'rgba(145, 145, 255, 1)',
      lineDash: [4],
    },
    '1132': {
      // 利旧380V电缆
      color: 'rgba(103, 220, 34, 1)',
      lineDash: [4],
    },
    '1133': {
      // 利旧10V电缆
      color: 'rgba(0, 255, 216, 1)',
      lineDash: [4],
    },
    '1134': {
      // 利旧20V电缆
      color: 'rgba(255, 175, 110, 1)',
      lineDash: [4],
    },

    '1141': {
      // 拆除220V电缆
      color: 'rgba(145, 145, 255, 1)',
      isDismantle: true,
    },
    '1142': {
      // 拆除380V电缆
      color: 'rgba(103, 220, 34, 1)',
      isDismantle: true,
    },
    '1143': {
      // 拆除10V电缆
      color: 'rgba(0, 255, 216, 1)',
      isDismantle: true,
    },
    '1144': {
      // 拆除20V电缆
      color: 'rgba(255, 175, 110, 1)',
      isDismantle: true,
    },
    '2010': {
      // 设计图层水平拉线（原有）
      color: 'rgba(188, 40, 184, 1)',
      img: '）    （',
    },
    '2011': {
      // 设计图层水平拉线（新建）
      color: 'rgba(188, 40, 184, 1)',
      img: '）    （',
      lineDash: [12],
    },
    '2012': {
      // 设计图层水平拉线（利旧）
      color: 'rgba(188, 40, 184, 1)',
      img: '）    （',
      lineDash: [4],
    },
    '2013': {
      // 设计图层水平拉线（拆除）
      color: 'rgba(188, 40, 184, 1)',
      img: '）    （',
      isDismantle: true,
    },
    '2020': {
      // 拆除图层水平拉线
      color: 'rgba(188, 40, 184, 1)',
      img: '）    （',
      isDismantle: true,
    },
  },
  fault_indicator: {
    size: 18,
    fillSize: 24,
    strokeSize: 26,
    color: 'white',
    fillColor: 'rgba(253, 81, 98, 1)',
    strokeColor: 'rgba(233, 233, 233, 0.65)',
    selected: {
      size: 22,
      fillSize: 30,
      strokeSize: 32,
      color: 'white',
      fillColor: 'rgba(249, 149, 52, 1)',
      strokeColor: 'rgba(233, 233, 233, 0.65)',
    },
    empty: {
      size: 26,
      fillSize: 26,
      strokeSize: 26,
      color: 'rgba(104, 0, 39, 1)',
      fillColor: 'rgba(254, 36, 36, 1)',
      strokeColor: 'rgba(233, 233, 233, 0.65)',
    },
  },
}

export default Styles
