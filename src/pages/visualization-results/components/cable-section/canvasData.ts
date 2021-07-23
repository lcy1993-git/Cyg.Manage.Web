const deg = 2 * Math.PI / 360;
const width = 150;
const unit = width / 2;
const pipeR3 = 75 * Math.cos(30 * deg) / (Math.cos(30 * deg) + 1)
const pipeR5 = unit / (1 + 1 / Math.sin(36 * deg));
const pipeR4 = unit / (1 / Math.sin(45 * deg) + 1);
const pipeR6 = unit / (2 / Math.cos(30 * deg) + 1);
const pipeR7 = unit / 3;

export const grooveEnum = {
  "t3350": {
    row: 3,
    col: 2
  },
  "t3500": {
    row: 3,
    col: 3
  },
  "t4350": {
    row: 4,
    col: 2
  },
  "t4500": {
    row: 4,
    col: 3
  },
  "t5500": {
    row: 5,
    col: 3
  },
}

/**
 * 直埋和排管方法
 * 
 * @param row 行数
 * @param col 列数
 * @param hasRedHole 默认为直埋，设置为true时为排管
 * @param width 默认宽度
 * @returns 
 */
export const getMatrixData: (row: number, col: number, hasRedHole?: boolean, width?: number) => any[]
  = (row = 1, col = 1, hasRedHole = false, width = 150) => {
    const flag = hasRedHole ? 1 : 0;
    const unitX = (width - flag * 20) / (col);
    const unitY = width / (row);
    const r = Math.min(unitX / 5, unitY / 5)
    const opArray = [];
    const sign = [];
    let number = -1;
    
    for (let i = row - 1; i >= 0; i--) {
      for (let j = 0; j < (flag ? col + 1 : col); j++) {
        number++
        if (flag && j === 0) {
          sign.push(number)
          opArray.push({
            x: 0,
            y: 0,
            r: 0
          })
        } else {
          opArray.push({
            x: (flag ? unitX * (j - .5) : unitX * (j + .5))  + flag * 20,
            y: unitY * (i + .5),
            r,
            stroke: "#000"
          })
        }
      }
    }
    if (hasRedHole) {
      opArray[sign[1]] = {
        x: 10,
        y: width / 2 - 20,
        r: Math.min(r * .7, 8),
        stroke: "#f00"
      }

      opArray[sign[0]] = {
        x: 10,
        y: width / 2 + 20,
        r: Math.min(r * .7, 8),
        stroke: "#f00"
      }

      // opArray.push({
      //   x: 10,
      //   y: width / 2 - 20,
      //   r: Math.min(r * .7, 8),
      //   stroke: "#f00"
      // })
      // opArray.push({
      //   x: 10,
      //   y: width / 2 + 20,
      //   r: Math.min(r * .7, 8),
      //   stroke: "#f00"
      // })
    }
    return opArray

  }
/**
 * 沟槽 已排序
 * 
 * @param row 
 * @param col 
 * @param isDouble 
 * @param width 
 * @returns 
 */
export const getGrooveData: (row: number, col: number, isDouble?: boolean, width?: number) => any
  = (row = 1, col = 1, isDouble = false, width = 150) => {

    const colNum = isDouble ? col * 2 : col;
    const circleArray = [];
    const lineArray = [];
    const maxWidth = isDouble ? (width - 10) / 2 : width * 2 / 3;
    const unit = Math.min(maxWidth / col, width / row);
    for (let i = row - 1; i >= 0; i--) {
      for (let j = 0; j < colNum; j++) {
        if (j < col) {
          circleArray.push({
            x: unit / 2 + unit * j,
            y: unit / 2 + unit * i,
            r: unit * .4
          })

        } else {
          circleArray.push({
            x: unit / 2 + unit * (j - col) + maxWidth + 10,
            y: unit / 2 + unit * i,
            r: unit * .4
          })
        }
      }
      lineArray.push({
        start: [0, unit * (i + 1) - 1],
        end: [maxWidth, unit * (i + 1) - 1],
        stroke: "red"
      })
      if (isDouble) {
        lineArray.push({
          start: [maxWidth + 10, unit * (i + 1) - 1],
          end: [maxWidth + maxWidth + 10, unit * (i + 1) - 1],
          stroke: "red"
        })
      }
    }
    return [
      circleArray,
      lineArray
    ]
  }

const type2200 = () => {
  const circleArray = [];
  const lineArray = [];
  const hUnit = (150 - 40) / 6
  for (let i = 2; i >= -2; i--) {

    for (let j = -2; j < 3; j++) {
      const base = j > 0 ? -5 : 5;
      j === 0 || circleArray.push({
        x: 75 + base + j * 25,
        y: hUnit * i + 75,
        r: 8
      })
    }
    lineArray.push({
      start: [75 - Math.sqrt(75 ** 2 - (hUnit * i + 8) ** 2), hUnit * i + 75 + 8],
      end: [65, hUnit * i + 75 + 8]
    })
    lineArray.push({
      start: [75 + Math.sqrt(75 ** 2 - (hUnit * i + 8) ** 2), hUnit * i + 75 + 8],
      end: [85, hUnit * i + 75 + 8]
    })

  }
  circleArray.push({
    x: 75,
    y: 75,
    r: 75,
    stroke: "#000"
  })
  return [
    circleArray,
    lineArray
  ]
}
const type2400 = () => {
  const circleArray = [];
  const lineArray = [];
  const hUnit = (150 - 40) / 6
  for (let i = 3; i >= -2; i --) {

    for (let j = -2; j < 3; j++) {
      const base = j > 0 ? -5 : 5;
      j === 0 || circleArray.push({
        x: 75 + base + j * 25,
        y: hUnit * i + 75 - 8,
        r: 8
      })
    }
    lineArray.push({
      start: [75 - Math.sqrt(75 ** 2 - (hUnit * i) ** 2), hUnit * i + 75],
      end: [65, hUnit * i + 75]
    })
    lineArray.push({
      start: [75 + Math.sqrt(75 ** 2 - (hUnit * i) ** 2), hUnit * i + 75],
      end: [85, hUnit * i + 75]
    })

  }
  circleArray.push({
    x: 75,
    y: 75,
    r: 75,
    stroke: "#000"
  })
  return [
    circleArray,
    lineArray
  ]
}
const type2600 = () => {
  const circleArray = [];
  const lineArray = [];
  const hUnit = (150 - 40) / 8
  for (let i = 3; i >= -3; i --) {

    for (let j = -2; j < 3; j++) {
      const base = j > 0 ? -5 : 5;
      j === 0 || circleArray.push({
        x: 75 + base + j * 25,
        y: hUnit * i + 75,
        r: 6
      })
    }
    lineArray.push({
      start: [75 - Math.sqrt(75 ** 2 - (hUnit * i + 8) ** 2), hUnit * i + 75 + 8],
      end: [65, hUnit * i + 75 + 8]
    })
    lineArray.push({
      start: [75 + Math.sqrt(75 ** 2 - (hUnit * i + 8) ** 2), hUnit * i + 75 + 8],
      end: [85, hUnit * i + 75 + 8]
    })

  }
  circleArray.push({
    x: 75,
    y: 75,
    r: 75,
    stroke: "#000"
  })
  return [
    circleArray,
    lineArray
  ]
}

// 拉管 (已经排序) 5孔 7孔待定
export const pipeMode5 = {
  type2: [
    {
      x: unit / 2,
      y: unit,
      r: unit / 2
    },
    {
      x: unit + unit / 2,
      y: unit,
      r: unit / 2
    },
    {
      x: unit,
      y: unit,
      r: unit
    }
  ],
  type3: [

    {
      x: unit - pipeR3,
      y: 2 * pipeR3 * Math.cos(30 * deg) + pipeR3,
      r: pipeR3
    },
    {
      x: unit + pipeR3,
      y: 2 * pipeR3 * Math.cos(30 * deg) + pipeR3,
      r: pipeR3
    },
    {
      x: unit,
      y: pipeR3,
      r: pipeR3
    },
    {
      x: unit,
      y: unit,
      r: unit
    },
  ],
  type4: [
    {
      x: unit - pipeR4,
      y: unit + pipeR4,
      r: pipeR4
    },
    {
      x: unit + pipeR4,
      y: unit + pipeR4,
      r: pipeR4
    },
    {
      x: unit - pipeR4,
      y: unit - pipeR4,
      r: pipeR4
    },
    {
      x: unit + pipeR4,
      y: unit - pipeR4,
      r: pipeR4
    },

    {
      x: unit,
      y: unit,
      r: unit
    }
  ],
  type5: [
    {
      x: unit,
      y: pipeR5,
      r: pipeR5,
    },
    {
      x: unit + (unit - pipeR5) * Math.cos(18 * deg),
      y: unit - (unit - pipeR5) * Math.sin(18 * deg),
      r: pipeR5,
    },
    {
      x: unit + pipeR5,
      y: unit + (unit - pipeR5) * Math.cos(36 * deg),
      r: pipeR5,
    },
    {
      x: unit - pipeR5,
      y: unit + (unit - pipeR5) * Math.cos(36 * deg),
      r: pipeR5,
    },
    {
      x: unit - (unit - pipeR5) * Math.cos(18 * deg),
      y: unit - (unit - pipeR5) * Math.sin(18 * deg),
      r: pipeR5,
    },
    {
      x: unit,
      y: unit,
      r: unit
    }
  ],
  type6: [
    {
      x: unit - 2 * pipeR6,
      y: pipeR6 + 4 * pipeR6 * Math.cos(30 * deg),
      r: pipeR6
    },
    {
      x: unit,
      y: pipeR6 + 4 * pipeR6 * Math.cos(30 * deg),
      r: pipeR6
    },
    {
      x: unit + 2 * pipeR6,
      y: pipeR6 + 4 * pipeR6 * Math.cos(30 * deg),
      r: pipeR6
    },

    {
      x: unit - pipeR6,
      y: pipeR6 + 2 * pipeR6 * Math.cos(30 * deg),
      r: pipeR6
    },
    {
      x: unit + pipeR6,
      y: pipeR6 + 2 * pipeR6 * Math.cos(30 * deg),
      r: pipeR6
    },
    {
      x: unit,
      y: pipeR6,
      r: pipeR6
    },
    {
      x: unit,
      y: unit,
      r: unit
    },
  ],
  type7: [
    { //4
      x: unit,
      y: unit,
      r: pipeR7
    },
    { //2
      x: unit + pipeR7,
      y: unit - 2 * Math.sin(60 * deg) * pipeR7,
      r: pipeR7
    },
    { //5
      x: unit + 2 * pipeR7,
      y: unit,
      r: pipeR7
    },
    { //7
      x: unit + pipeR7,
      y: unit + 2 * Math.sin(60 * deg) * pipeR7,
      r: pipeR7
    },
    {  //6
      x: unit - pipeR7,
      y: unit + 2 * Math.sin(60 * deg) * pipeR7,
      r: pipeR7
    },
    { //3
      x: pipeR7,
      y: unit,
      r: pipeR7
    },
    { //1
      x: unit - pipeR7,
      y: unit - 2 * Math.sin(60 * deg) * pipeR7,
      r: pipeR7
    },






    {
      x: unit,
      y: unit,
      r: unit
    }
  ]
};

// 顶管 (已经排序)
export const pipeJacking = {
  type1200: [
    // row4
    {
      x: 75 - 40,
      y: 75 + 40,
      r: 6,
      stroke: "red"
    },

    {
      x: 75 - 5 - 7.5,
      y: 75 + 40,
      r: 9
    },
    {
      x: 75 + 5 + 7.5,
      y: 75 + 40,
      r: 9
    },
    {
      x: 0,
      y: 0,
      r: 0
    },
    {
      x: 0,
      y: 0,
      r: 0
    },
    // row3
    {
      x: 75 - 40,
      y: 75 + 5 + 7.5,
      r: 9
    },
    {
      x: 75 - 5 - 7.5,
      y: 75 + 5 + 7.5,
      r: 9
    },
    {
      x: 75 + 5 + 7.5,
      y: 75 + 5 + 7.5,
      r: 9
    },
    {
      x: 75 + 40,
      y: 75 + 5 + 7.5,
      r: 9
    },
    {
      x: 0,
      y: 0,
      r: 0
    },
    // row2
    {
      x: 75 - 40,
      y: 75 - 5 - 7.5,
      r: 9
    },
    {
      x: 75 - 5 - 7.5,
      y: 75 - 5 - 7.5,
      r: 9
    },
    {
      x: 75 + 5 + 7.5,
      y: 75 - 5 - 7.5,
      r: 9
    },
    {
      x: 75 + 40,
      y: 75 - 5 - 7.5,
      r: 9
    },
    {
      x: 0,
      y: 0,
      r: 0
    },
    //row1
    {
      x: 75 - 40,
      y: 75 - 40,
      r: 6,
      stroke: "red"
    },
    {
      x: 0,
      y: 0,
      r: 0
    },
    {
      x: 75 - 5 - 7.5,
      y: 75 - 40,
      r: 9
    },
    {
      x: 75 + 5 + 7.5,
      y: 75 - 40,
      r: 9
    },
    {
      x: 0,
      y: 0,
      r: 0
    },
    {
      x: 75,
      y: 75,
      r: 75,
      // stroke: "#000",
      // fill: 'rgba(0,0,0,0)'
    },


  ],
  type1500: [


    // row0
    {
      x: 75 - 55,
      y: 75 + 30,
      r: 5,
      stroke: "red"
    },
    {
      x: 9 + 75 - 37,
      y: 75 + 37,
      r: 9
    },
    {
      x: 9 + 75 - 5 - 7.5,
      y: 75 + 37,
      r: 9
    },
    {
      x: 9 + 75 + 5 + 7.5,
      y: 75 + 37,
      r: 9
    },
    {
      x: 9 + 75 + 37,
      y: 75 + 37,
      r: 9
    },
    // row1
    {
      x: 75 - 55,
      y: 75 - 30,
      r: 5,
      stroke: "red"
    },
    {
      x: 9 + 75 - 37,
      y: 75 + 5 + 7.5,
      r: 9
    },
    {
      x: 9 + 75 - 5 - 7.5,
      y: 75 + 5 + 7.5,
      r: 9
    },
    {
      x: 9 + 75 + 5 + 7.5,
      y: 75 + 5 + 7.5,
      r: 9
    },
    {
      x: 9 + 75 + 37,
      y: 75 + 5 + 7.5,
      r: 9
    },
    // row2
    {
      x: 0,
      y: 0,
      r: 0,
      stroke: "red"
    },
    {
      x: 9 + 75 - 37,
      y: 75 - 5 - 7.5,
      r: 9
    },
    {
      x: 9 + 75 - 5 - 7.5,
      y: 75 - 5 - 7.5,
      r: 9
    },
    {
      x: 9 + 75 + 5 + 7.5,
      y: 75 - 5 - 7.5,
      r: 9
    },
    {
      x: 9 + 75 + 37,
      y: 75 - 5 - 7.5,
      r: 9
    },
    // row3
    {
      x: 0,
      y: 0,
      r: 0,
      stroke: "red"
    },
    {
      x: 9 + 75 - 37,
      y: 75 - 37,
      r: 9
    },
    {
      x: 9 + 75 - 5 - 7.5,
      y: 75 - 37,
      r: 9
    },
    {
      x: 9 + 75 + 5 + 7.5,
      y: 75 - 37,
      r: 9
    },
    {
      x: 9 + 75 + 37,
      y: 75 - 37,
      r: 9
    },
    {
      x: 75,
      y: 75,
      r: 75,
      stroke: "#000"
    },


  ],
  type2200,
  type2400,
  type2600,
}



