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
          fillColor: 'rgba(250, 104, 135, 1)',
          strokeColor: 'rgba(255, 255, 255, 0.75)',
      },
      empty: {
          size: 26,
          fillSize: 24,
          strokeSize: 24,
          color: 'rgba(221, 64, 27, 1)',
          fillColor: 'rgba(255, 255, 255, 1)',
          strokeColor: 'rgba(255, 255, 255, 0)',
      }
  },
  cable: {
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
          fillColor: 'rgba(250, 104, 135, 1)',
          strokeColor: 'rgba(255, 255, 255, 0.75)',
      },
      empty: {
          size: 16,
          fillSize: 24,
          strokeSize: 26,
          color: 'white',
          fillColor: 'rgba(221, 64, 27, 1)',
          strokeColor: 'rgba(126, 38, 17, 1)',
      }
  },
  transformer: {
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
          fillColor: 'rgba(250, 104, 135, 1)',
          strokeColor: 'rgba(255, 255, 255, 0.75)',
      },
      empty: {
          size: 32,
          fillSize: 38,
          strokeSize: 40,
          color: 'white',
          fillColor: 'rgba(221, 64, 27, 1)',
          strokeColor: 'rgba(126, 38, 17, 1)',
      }
  },
  cable_equipment:
  {
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
          fillColor: 'rgba(250, 104, 135, 1)',
          strokeColor: 'rgba(255, 255, 255, 0.75)',
      },
      empty: {
          size: 16,
          fillSize: 24,
          strokeSize: 26,
          color: 'white',
          fillColor: 'rgba(221, 64, 27, 1)',
          strokeColor: 'rgba(126, 38, 17, 1)',
      }
  },
  electric_meter:
  {
      size: 28,
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
          fillColor: 'rgba(250, 104, 135, 1)',
          strokeColor: 'rgba(255, 255, 255, 0.75)',
      },
      empty: {
          size: 32,
          fillSize: 38,
          strokeSize: 40,
          color: 'white',
          fillColor: 'rgba(221, 64, 27, 1)',
          strokeColor: 'rgba(126, 38, 17, 1)',
      }
  },
  cross_arm : {
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
          color: 'rgba(250, 104, 135, 1)',
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
      }
  },
  over_head_device: {
      size: 18,
      fillSize: 22,
      strokeSize: 25,
      color: 'white',
      fillColor: 'rgba(134, 117, 234, 1)',
      strokeColor: 'rgba(50, 46, 77, 0.5)',
      selected: {
          size: 18,
          fillSize: 22,
          strokeSize: 25,
          color: 'white',
          fillColor: 'rgba(75, 32, 238, 1)',
          strokeColor: 'rgba(255, 255, 255, 0.5)',
      },
      empty: {
          size: 18,
          fillSize: 22,
          strokeSize: 25,
          color: 'white',
          fillColor: 'rgba(221, 64, 27, 1)',
          strokeColor: 'rgba(126, 38, 17, 1)',
      }
  },
  line: {
      cableChannel: {
          color: 'rgba(58, 46, 70, 1)',
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          width: 8
      },
      fzx: {
          color: 'rgba(0,191,255, 0.5)',
          lineDash: true,
          width: 2
      },
      selected: {
          text1: '\ue887\ue887',
          text2: '\ue887\ue887\ue887\ue887',
          color: 'rgba(250, 104, 135, 0.9)',
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          width: 9
      },
      default: {
          backgroundColor: 'rgba(13, 35, 26, 0.5)',
          width: 4
      },
      "1011": { // 原有220V
          color: 'rgba(145, 145, 255, 1)',
          img: '../images_new/220V电压',
          lineDash: false
      },
      "1012": { // 原有380V
          color: 'rgba(158, 227, 24, 1)',
          img: '../images_new/380V电压',
          lineDash: false
      },
      "1013": { // 原有10kV
          color: 'rgba(0, 255, 216, 1)',
          lineDash: false
      },
      "1014": { // 原有20kV
          color: 'rgba(255, 175, 110, 1)',
          lineDash: false
      },

      "1021": { // 新建220V
          color: 'rgba(145, 145, 255, 1)',
          img: '../images_new/220V电压',
          lineDash: true
      },
      "1022": { // 新建380V
          color: 'rgba(158, 227, 24, 1)',
          img: '../images_new/380V电压',
          lineDash: true
      },
      "1023": { // 新建10kV
          color: 'rgba(0, 255, 216, 1)',
          lineDash: true
      },
      "1024": { // 新建20kV
          color: 'rgba(255, 175, 110, 1)',
          lineDash: true
      },

      "1111": { // 原有220V电缆
          color: 'rgba(145, 145, 255, 1)',
          lineDash: false,
          cableColor: 'rgba(145, 145, 255, 1)'
      },
      "1112": { // 原有380V电缆
          color: 'rgba(158, 227, 24, 1)',
          lineDash: false,
          cableColor: 'rgba(158, 227, 24, 1)'
      },
      "1113": { // 原有10kV电缆
          color: 'rgba(16, 255, 157, 1)',
          lineDash: false,
          cableColor: 'rgba(0, 255, 216, 1)'
      },
      "1114": { // 原有20kV电缆
          color: 'rgba(255, 175, 110, 1)',
          lineDash: false,
          cableColor: 'rgba(255, 175, 110, 1)'
      },

      "1121": { // 新建220V电缆
          color: 'rgba(145, 145, 255, 1)',
          lineDash: true,
          cableColor: 'rgba(145, 145, 255, 1)',
      },
      "1122": { // 新建380V电缆
          color: 'rgba(158, 227, 24, 1)',
          lineDash: true,
          cableColor: 'rgba(158, 227, 24, 1)'
      },
      "1123": { // 新建10V电缆
          color: 'rgba(16, 255, 157, 1)',
          lineDash: true,
          cableColor: 'rgba(0, 255, 216, 1)'
      },
      "1124": { // 新建20V电缆
          color: 'rgba(255, 175, 110, 1)',
          lineDash: true,
          cableColor: 'rgba(255, 175, 110, 1)'
      },
  }
}

export default Styles;