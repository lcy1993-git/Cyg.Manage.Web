import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'

export const optionConfig = {
  allAll: [
    {
      tab: '所有事件',
      key: 'event',
      options: {
        animation: false,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: ['管理端', '勘察端', '设计端'],
        },
        series: [
          {
            name: '2011',
            type: 'bar',
            barWidth: 24, //柱图宽度
            label: {
              show: true,
              position: 'insideLeft',
            },
            data: [
              {
                value: 50,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#E2DE49' },
                    { offset: 1, color: '#667707' },
                  ]),
                },
              },
              {
                value: 110,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#50DFD4' },
                    { offset: 1, color: '#087070' },
                  ]),
                },
              },
              {
                value: 200,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: 'rgba(74, 191, 63, 1)' },
                    { offset: 1, color: 'rgba(14, 123, 59, 1)' },
                  ]),
                },
              },
            ],
          },
        ],
      },
    },
    {
      tab: '时间',
      key: 'time',
      options: {
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: 'white',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            name: '时间',
            nameGap: 40,
            nameLocation: 'center',
            axisLabel: {
              rotate: 40,
            },
            data: [
              '00:00:00',
              '02:00:00',
              '04:00:00',
              '06:00:00',
              '08:00:00',
              '10:00:00',
              '12:00:00',
              '14:00:00',
              '16:00:00',
              '18:00:00',
              '20:00:00',
              '22:00:00',
              '24:00:00',
            ],
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '计数',
            offset: 5,
            splitLine: {
              //网格线
              lineStyle: {
                type: 'dashed', //设置网格线类型 dotted：虚线   solid:实线
                width: 1,
              },
              show: true, //隐藏或显示
            },
            nameStyle: {
              fontWeight: 500,
            },
            axisLabel: {
              interval: 1000,
              formatter: function (value: number, index: number) {
                let val
                if (value >= 10000) {
                  val = value / 10000 + 'w'
                } else if (value >= 1000) {
                  val = value / 1000 + 'k'
                } else if (value < 1000) {
                  val = value
                }
                return val
              },
            },
            nameGap: 35,
            nameRotate: 90,
            nameLocation: 'center',
          },
        ],
        series: [
          {
            lineStyle: {
              color: 'rgba(77, 169, 68, 1)',
            },
            // symbol:'none',
            showSymbol: false,
            type: 'line',
            stack: 'Total',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(77, 169, 68, 0.9)',
                },
                {
                  offset: 1,
                  color: 'rgba(77, 169, 68, 0.3)',
                },
              ]),
            },
            emphasis: {
              focus: 'series',
            },
            data: [1200, 1320, 11, 134, 590, 50, 2140, 20, 655, 2101, 4, 790, 1130, 210],
          },
        ],
      },
    },
  ],
  allSystem: [
    {
      tab: '所有事件',
      key: 'event',
      options: {
        animation: false,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: ['管理端', '勘察端', '设计端'],
        },
        series: [
          {
            name: '2011',
            type: 'bar',
            barWidth: 24, //柱图宽度
            label: {
              show: true,
              position: 'insideLeft',
            },
            data: [
              {
                value: 2201,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#E2DE49' },
                    { offset: 1, color: '#667707' },
                  ]),
                },
              },
              {
                value: 437,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#50DFD4' },
                    { offset: 1, color: '#087070' },
                  ]),
                },
              },
              {
                value: 777,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: 'rgba(74, 191, 63, 1)' },
                    { offset: 1, color: 'rgba(14, 123, 59, 1)' },
                  ]),
                },
              },
            ],
          },
        ],
      },
    },
    {
      tab: '时间',
      key: 'time',
      options: {
        animation: false,

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: 'white',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            name: '时间',
            nameGap: 40,
            nameLocation: 'center',
            axisLabel: {
              rotate: 40,
            },
            data: [
              '00:00:00',
              '02:00:00',
              '04:00:00',
              '06:00:00',
              '08:00:00',
              '10:00:00',
              '12:00:00',
              '14:00:00',
              '16:00:00',
              '18:00:00',
              '20:00:00',
              '22:00:00',
              '24:00:00',
            ],
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '计数',
            offset: 5,
            splitLine: {
              //网格线
              lineStyle: {
                type: 'dashed', //设置网格线类型 dotted：虚线   solid:实线
                width: 1,
              },
              show: true, //隐藏或显示
            },
            nameStyle: {
              fontWeight: 500,
            },
            axisLabel: {
              interval: 1000,
              formatter: function (value: number, index: number) {
                let val
                if (value >= 10000) {
                  val = value / 10000 + 'w'
                } else if (value >= 1000) {
                  val = value / 1000 + 'k'
                } else if (value < 1000) {
                  val = value
                }
                return val
              },
            },
            nameGap: 35,
            nameRotate: 90,
            nameLocation: 'center',
          },
        ],
        series: [
          {
            lineStyle: {
              color: 'rgba(77, 169, 68, 1)',
            },
            // symbol:'none',
            showSymbol: false,
            type: 'line',
            stack: 'Total',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(77, 169, 68, 0.9)',
                },
                {
                  offset: 1,
                  color: 'rgba(77, 169, 68, 0.3)',
                },
              ]),
            },
            emphasis: {
              focus: 'series',
            },
            data: [10, 10, 101, 44, 55, 50, 2140, 10, 65, 21, 64, 70, 10, 2],
          },
        ],
      },
    },
  ],
  allBusiness: [
    {
      tab: '所有事件',
      key: 'event',
      options: {
        animation: false,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: ['管理端', '勘察端', '设计端'],
        },
        series: [
          {
            name: '2011',
            type: 'bar',
            barWidth: 24, //柱图宽度
            label: {
              show: true,
              position: 'insideLeft',
            },
            data: [
              {
                value: 221,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#E2DE49' },
                    { offset: 1, color: '#667707' },
                  ]),
                },
              },
              {
                value: 4447,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#50DFD4' },
                    { offset: 1, color: '#087070' },
                  ]),
                },
              },
              {
                value: 777,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: 'rgba(74, 191, 63, 1)' },
                    { offset: 1, color: 'rgba(14, 123, 59, 1)' },
                  ]),
                },
              },
            ],
          },
        ],
      },
    },
    {
      tab: '时间',
      key: 'time',
      options: {
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: 'white',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            name: '时间',
            nameGap: 40,
            nameLocation: 'center',
            axisLabel: {
              rotate: 40,
            },
            data: [
              '00:00:00',
              '02:00:00',
              '04:00:00',
              '06:00:00',
              '08:00:00',
              '10:00:00',
              '12:00:00',
              '14:00:00',
              '16:00:00',
              '18:00:00',
              '20:00:00',
              '22:00:00',
              '24:00:00',
            ],
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '计数',
            offset: 5,
            splitLine: {
              //网格线
              lineStyle: {
                type: 'dashed', //设置网格线类型 dotted：虚线   solid:实线
                width: 1,
              },
              show: true, //隐藏或显示
            },
            nameStyle: {
              fontWeight: 500,
            },
            axisLabel: {
              interval: 1000,
              formatter: function (value: number, index: number) {
                let val
                if (value >= 10000) {
                  val = value / 10000 + 'w'
                } else if (value >= 1000) {
                  val = value / 1000 + 'k'
                } else if (value < 1000) {
                  val = value
                }
                return val
              },
            },
            nameGap: 35,
            nameRotate: 90,
            nameLocation: 'center',
          },
        ],
        series: [
          {
            lineStyle: {
              color: 'rgba(77, 169, 68, 1)',
            },
            // symbol:'none',
            showSymbol: false,
            type: 'line',
            stack: 'Total',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(77, 169, 68, 0.9)',
                },
                {
                  offset: 1,
                  color: 'rgba(77, 169, 68, 0.3)',
                },
              ]),
            },
            emphasis: {
              focus: 'series',
            },
            data: [
              12100,
              1320,
              10111,
              41234,
              5590,
              23550,
              2140,
              1720,
              6555,
              27101,
              6134,
              77790,
              1130,
              210,
            ],
          },
        ],
      },
    },
  ],
  sysLogin: [
    {
      tab: '登录',
      key: 'login',
      options: {
        animation: false,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: ['管理端', '勘察端', '设计端'],
        },
        series: [
          {
            name: '2011',
            type: 'bar',
            barWidth: 24, //柱图宽度
            label: {
              show: true,
              position: 'insideLeft',
            },
            data: [
              {
                value: 50,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#E2DE49' },
                    { offset: 1, color: '#667707' },
                  ]),
                },
              },
              {
                value: 110,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#50DFD4' },
                    { offset: 1, color: '#087070' },
                  ]),
                },
              },
              {
                value: 200,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: 'rgba(74, 191, 63, 1)' },
                    { offset: 1, color: 'rgba(14, 123, 59, 1)' },
                  ]),
                },
              },
            ],
          },
        ],
      },
    },
    {
      tab: '登陆趋势',
      key: 'loginTrend',
      options: {
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: 'white',
            },
          },
        },
        legend: {
          data: ['管理端', '勘察端', '设计端'],
          orient: 'vertical',
          right: 'right',
          top: 60,
        },
        grid: {
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            name: '时间',
            nameGap: 40,
            nameLocation: 'center',
            axisLabel: {
              rotate: 40,
            },
            data: [
              '00:00:00',
              '02:00:00',
              '04:00:00',
              '06:00:00',
              '08:00:00',
              '10:00:00',
              '12:00:00',
              '14:00:00',
              '16:00:00',
              '18:00:00',
              '20:00:00',
              '22:00:00',
              '24:00:00',
            ],
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '计数',
            offset: 5,
            splitLine: {
              //网格线
              lineStyle: {
                type: 'dashed', //设置网格线类型 dotted：虚线   solid:实线
                width: 1,
              },
              show: true, //隐藏或显示
            },
            nameStyle: {
              fontWeight: 500,
            },
            axisLabel: {
              interval: 1000,
              formatter: function (value: number, index: number) {
                let val
                if (value >= 10000) {
                  val = value / 10000 + 'w'
                } else if (value >= 1000) {
                  val = value / 1000 + 'k'
                } else if (value < 1000) {
                  val = value
                }
                return val
              },
            },
            nameGap: 35,
            nameRotate: 90,
            nameLocation: 'center',
          },
        ],
        series: [
          {
            left: 200,
            name: '管理端',
            lineStyle: {
              color: '#2A9B3D',
              width: 3,
            },
            itemStyle: {
              normal: {
                color: '#2A9B3D',
              },
            },
            symbol: 'triangle',
            showSymbol: true,
            symbolSize: 8,
            type: 'line',
            stack: 'Total',
            emphasis: {
              focus: 'series',
            },
            data: [11, 22, 335, 44, 56, 66, 77, 828, 66, 55, 22, 959, 22, 445],
          },
          {
            name: '勘察端',
            lineStyle: {
              color: '#30BABF',
              width: 3,
            },
            itemStyle: {
              normal: {
                color: '#30BABF',
              },
            },
            symbol: 'rect',
            symbolSize: 8,
            showSymbol: true,
            type: 'line',
            stack: 'Total',
            emphasis: {
              focus: 'series',
            },
            data: [123, 223, 441, 226, 336, 124, 778, 542, 147, 455, 441, 112, 483, 453],
          },
          {
            name: '设计端',
            lineStyle: {
              color: '#C3C813',
              width: 3,
            },
            itemStyle: {
              normal: {
                color: '#C3C813',
              },
            },
            symbol: 'rect',
            symbolRotate: 45,
            showSymbol: true,
            symbolSize: 8,
            type: 'line',
            stack: 'Total',
            emphasis: {
              focus: 'series',
            },
            data: [737, 88, 11, 888, 590, 50, 77, 20, 2, 22, 444, 790, 453, 783],
          },
        ],
      },
    },
  ],
  sysExitLogin: [
    {
      tab: '退出登录',
      key: 'exitLogin',
      options: {
        animation: false,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: ['管理端', '勘察端', '设计端'],
        },
        series: [
          {
            name: '2011',
            type: 'bar',
            barWidth: 24, //柱图宽度
            label: {
              show: true,
              position: 'insideLeft',
            },
            data: [
              {
                value: 50,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#E2DE49' },
                    { offset: 1, color: '#667707' },
                  ]),
                },
              },
              {
                value: 110,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#50DFD4' },
                    { offset: 1, color: '#087070' },
                  ]),
                },
              },
              {
                value: 200,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: 'rgba(74, 191, 63, 1)' },
                    { offset: 1, color: 'rgba(14, 123, 59, 1)' },
                  ]),
                },
              },
            ],
          },
        ],
      },
    },
    {
      tab: '登陆趋势',
      key: 'exitLoginTrend',
      options: {
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: 'white',
            },
          },
        },
        legend: {
          data: ['管理端', '勘察端', '设计端'],
          orient: 'vertical',
          right: 'right',
          top: 60,
        },
        grid: {
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            name: '时间',
            nameGap: 40,
            nameLocation: 'center',
            axisLabel: {
              rotate: 40,
            },
            data: [
              '00:00:00',
              '02:00:00',
              '04:00:00',
              '06:00:00',
              '08:00:00',
              '10:00:00',
              '12:00:00',
              '14:00:00',
              '16:00:00',
              '18:00:00',
              '20:00:00',
              '22:00:00',
              '24:00:00',
            ],
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '计数',
            offset: 5,
            splitLine: {
              //网格线
              lineStyle: {
                type: 'dashed', //设置网格线类型 dotted：虚线   solid:实线
                width: 1,
              },
              show: true, //隐藏或显示
            },
            nameStyle: {
              fontWeight: 500,
            },
            axisLabel: {
              interval: 1000,
              formatter: function (value: number, index: number) {
                let val
                if (value >= 10000) {
                  val = value / 10000 + 'w'
                } else if (value >= 1000) {
                  val = value / 1000 + 'k'
                } else if (value < 1000) {
                  val = value
                }
                return val
              },
            },
            nameGap: 35,
            nameRotate: 90,
            nameLocation: 'center',
          },
        ],
        series: [
          {
            left: 200,
            name: '管理端',
            lineStyle: {
              color: '#2A9B3D',
              width: 3,
            },
            itemStyle: {
              normal: {
                color: '#2A9B3D',
              },
            },
            symbol: 'triangle',
            showSymbol: true,
            symbolSize: 8,
            type: 'line',
            stack: 'Total',
            emphasis: {
              focus: 'series',
            },
            data: [11, 22, 335, 44, 56, 66, 77, 828, 66, 55, 22, 959, 22, 445],
          },
          {
            name: '勘察端',
            lineStyle: {
              color: '#30BABF',
              width: 3,
            },
            itemStyle: {
              normal: {
                color: '#30BABF',
              },
            },
            symbol: 'rect',
            symbolSize: 8,
            showSymbol: true,
            type: 'line',
            stack: 'Total',
            emphasis: {
              focus: 'series',
            },
            data: [123, 223, 441, 226, 336, 124, 778, 542, 147, 455, 441, 112, 483, 453],
          },
          {
            name: '设计端',
            lineStyle: {
              color: '#C3C813',
              width: 3,
            },
            itemStyle: {
              normal: {
                color: '#C3C813',
              },
            },
            symbol: 'rect',
            symbolRotate: 45,
            showSymbol: true,
            symbolSize: 8,
            type: 'line',
            stack: 'Total',
            emphasis: {
              focus: 'series',
            },
            data: [737, 88, 11, 888, 590, 50, 77, 20, 2, 22, 444, 790, 453, 783],
          },
        ],
      },
    },
  ],
  sysChangingAccountStatus: [
    {
      tab: '账号状态修改报表',
      key: 'sysChangingAccountStatus',
      options: {
        animation: false,
        tooltip: {
          trigger: 'item',
        },
        color: ['#358FDE', '#8C8E9D', '#F67443', '#4DA944'],
        series: [
          {
            type: 'pie',
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1,
            },
            data: [
              { value: 22, name: '启用' },
              { value: 55, name: '注销' },
              { value: 12, name: '禁用' },
              { value: 43, name: '新建' },
            ],
            emphasis: {
              // itemStyle: {
              //   shadowBlur: 10,
              //   shadowOffsetX: 0,
              //   shadowColor: 'rgba(0, 0, 0, 0.5)'
              // }
            },
            radius: ['15%', '75%'],
          },
        ],
      },
    },
  ],
  sysChangingPasswordStatus: [
    {
      tab: '账号密码修改报表',
      key: 'sysChangingAccountStatus',
      options: {
        animation: false,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          inverse: true,
          data: ['张三', '李四', '周杰伦', '赵信', '艾克'],
        },
        series: [
          {
            name: '2011',
            type: 'bar',
            barWidth: 24, //柱图宽度
            label: {
              show: true,
              position: 'insideLeft',
              color: '#fff',
            },
            data: [
              {
                value: 10,
                itemStyle: {
                  color: '#F17453',
                },
              },
              {
                value: 8,
                itemStyle: {
                  color: '#EE9B48',
                },
              },
              {
                value: 7,
                itemStyle: {
                  color: '#DEC72D',
                },
              },
              {
                value: 5,
                itemStyle: {
                  color: '#A3CC4F',
                },
              },
              {
                value: 3,
                itemStyle: {
                  color: '#61CB92',
                },
              },
            ],
          },
        ],
      },
    },
  ],
  sysFileTransfer: [
    {
      tab: '文件传输报表',
      key: 'sysFileTransfer',
      options: {
        animation: false,
        grid: {
          left: '3%',
          right: '8%',
          bottom: '6%',
          containLabel: true,
        },
        legend: {
          data: ['文件上传', '文件下载'],
          orient: 'vertical',
          right: 'right',
          top: 60,
        },
        xAxis: {
          name: '计数',
          // offset: 5,
          // nameRotate: 90,
          nameGap: 25,
          nameLocation: 'center',
          type: 'value',
          boundaryGap: [0, 0.01],
          splitLine: {
            //网格线
            lineStyle: {
              type: 'dashed', //设置网格线类型 dotted：虚线   solid:实线
              width: 1,
            },
            show: true, //隐藏或显示
          },
        },
        yAxis: {
          type: 'category',
          data: ['管理端', '勘察端', '设计端'],
        },
        series: [
          {
            name: '文件上传',
            type: 'bar',
            barWidth: 14, //柱图宽度
            data: [10, 20, 30],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                { offset: 0, color: '#5093DF' },
                { offset: 1, color: '#1245AB' },
              ]),
            },
          },
          {
            name: '文件下载',
            type: 'bar',
            barWidth: 14, //柱图宽度
            data: [12, 55, 65],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                { offset: 0, color: '#3FBF6E' },
                { offset: 1, color: '#0E7B56' },
              ]),
            },
          },
        ],
      },
    },
  ],
  sysConnectionTimeout: [
    {
      tab: '连接超时报表',
      key: 'sysConnectionTimeout',
      options: {
        animation: false,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: ['管理端', '勘察端', '设计端'],
        },
        series: [
          {
            name: '2011',
            type: 'bar',
            barWidth: 24, //柱图宽度
            label: {
              show: true,
              position: 'insideLeft',
            },
            data: [
              {
                value: 50,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#E2DE49' },
                    { offset: 1, color: '#667707' },
                  ]),
                },
              },
              {
                value: 110,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#50DFD4' },
                    { offset: 1, color: '#087070' },
                  ]),
                },
              },
              {
                value: 200,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: 'rgba(74, 191, 63, 1)' },
                    { offset: 1, color: 'rgba(14, 123, 59, 1)' },
                  ]),
                },
              },
            ],
          },
        ],
      },
    },
  ],
  businessProjectDataChange: [
    {
      tab: '项目数据修改报表',
      key: 'businessProjectDataChange',
      options: {
        animation: false,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: ['管理端', '勘察端', '设计端'],
        },
        series: [
          {
            name: '2011',
            type: 'bar',
            barWidth: 24, //柱图宽度
            label: {
              show: true,
              position: 'insideLeft',
            },
            data: [
              {
                value: 50,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#E2DE49' },
                    { offset: 1, color: '#667707' },
                  ]),
                },
              },
              {
                value: 110,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#50DFD4' },
                    { offset: 1, color: '#087070' },
                  ]),
                },
              },
              {
                value: 200,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: 'rgba(74, 191, 63, 1)' },
                    { offset: 1, color: 'rgba(14, 123, 59, 1)' },
                  ]),
                },
              },
            ],
          },
        ],
      },
    },
  ],
  businessProjectFlowChange: [
    {
      tab: '项目流程变化报表',
      key: 'businessProjectFlowChange',
      options: {
        animation: false,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: ['管理端', '勘察端', '设计端'],
        },
        series: [
          {
            name: '2011',
            type: 'bar',
            barWidth: 24, //柱图宽度
            label: {
              show: true,
              position: 'insideLeft',
            },
            data: [
              {
                value: 50,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#E2DE49' },
                    { offset: 1, color: '#667707' },
                  ]),
                },
              },
              {
                value: 110,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#50DFD4' },
                    { offset: 1, color: '#087070' },
                  ]),
                },
              },
              {
                value: 200,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: 'rgba(74, 191, 63, 1)' },
                    { offset: 1, color: 'rgba(14, 123, 59, 1)' },
                  ]),
                },
              },
            ],
          },
        ],
      },
    },
  ],
}
