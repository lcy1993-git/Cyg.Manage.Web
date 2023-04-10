import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import {
  ConnectTimeoutAllClient,
  FileTransferStatisticsAllClient,
  GetAccountChangeEventCount,
  getAuditEventChartInfo,
  GetLoinoutTrends,
  getQtyByClientType,
  PassWordRestRank,
  ProjectChangeAllClient,
  ProjectModifyAllClient,
  ProjectProcessChangeAllClient,
  ResourceLibChangeAllClient,
} from '@/services/security-audit'

export const optionConfig = {
  allAll: [
    {
      tab: '所有事件',
      key: 'event',
      options: {
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          top: 30,
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          minInterval: 1,
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: [],
        },
        series: [
          {
            name: '所有事件',
            type: 'bar',
            barWidth: 24, //柱图宽度
            label: {
              show: true,
              position: 'insideLeft',
            },
            data: [
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#E2DE49' },
                    { offset: 1, color: '#667707' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#50DFD4' },
                    { offset: 1, color: '#087070' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: 'rgba(74, 191, 63, 1)' },
                    { offset: 1, color: 'rgba(14, 123, 59, 1)' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#EFC376' },
                    { offset: 1, color: '#B88A39' },
                  ]),
                },
              },
            ],
          },
        ],
      },
      getData: async () => {
        return await getQtyByClientType({})
      },
      dealChartData: (data: any, options: any) => {
        options.yAxis.data = data.map((item: { clientTypeText: any }) => item.clientTypeText)
        options.series[0].data = options.series[0].data.map(
          (item: { value: any }, index: string | number) => {
            item.value = data[index]?.count
            return item
          }
        )
        return options
      },
    },
    {
      tab: '时间',
      key: 'time',
      options: {
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: false,
        },
        grid: {
          top: 30,
          left: '4%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            name: '时间',
            nameGap: 45,
            nameLocation: 'center',
            axisLabel: {
              rotate: 40,
            },
            data: [],
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
              formatter: function (value: number) {
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
            data: [],
          },
        ],
      },
      getData: async () => {
        return await getAuditEventChartInfo({})
      },
      dealChartData: (data: any, options: any) => {
        options.xAxis[0].data = data.map((item: any) => item.time.slice(11, 19))
        options.series[0].data = data.map((item: any) => item.count)
        return options
      },
    },
  ],
  allSystem: [
    {
      tab: '系统事件',
      key: 'event',
      options: {
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          top: 30,
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          minInterval: 1,
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: [],
        },
        series: [
          {
            name: '系统事件',
            type: 'bar',
            barWidth: 24, //柱图宽度
            label: {
              show: true,
              position: 'insideLeft',
            },
            data: [
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#E2DE49' },
                    { offset: 1, color: '#667707' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#50DFD4' },
                    { offset: 1, color: '#087070' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: 'rgba(74, 191, 63, 1)' },
                    { offset: 1, color: 'rgba(14, 123, 59, 1)' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#EFC376' },
                    { offset: 1, color: '#B88A39' },
                  ]),
                },
              },
            ],
          },
        ],
      },
      getData: async () => {
        return await getQtyByClientType({
          auditType: 1,
        })
      },
      dealChartData: (data: any, options: any) => {
        options.yAxis.data = data.map((item: { clientTypeText: any }) => item.clientTypeText)
        options.series[0].data = options.series[0].data.map(
          (item: { value: any }, index: string | number) => {
            item.value = data[index]?.count
            return item
          }
        )
        return options
      },
    },
    {
      tab: '时间',
      key: 'time',
      options: {
        animation: false,

        tooltip: {
          trigger: 'axis',
          axisPointer: false,
        },
        grid: {
          top: 30,
          left: '4%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            name: '时间',
            nameGap: 45,
            nameLocation: 'center',
            axisLabel: {
              rotate: 40,
            },
            data: [],
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
              formatter: function (value: number) {
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
            data: [],
          },
        ],
      },
      getData: async () => {
        return await getAuditEventChartInfo({
          auditType: 1,
        })
      },
      dealChartData: (data: any, options: any) => {
        options.xAxis[0].data = data.map((item: any) => item.time.slice(11, 19))
        options.series[0].data = data.map((item: any) => item.count)
        return options
      },
    },
  ],
  allBusiness: [
    {
      tab: '业务事件',
      key: 'event',
      options: {
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          top: 30,
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          minInterval: 1,
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: [],
        },
        series: [
          {
            name: '业务事件',
            type: 'bar',
            barWidth: 24, //柱图宽度
            label: {
              show: true,
              position: 'insideLeft',
            },
            data: [
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#E2DE49' },
                    { offset: 1, color: '#667707' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#50DFD4' },
                    { offset: 1, color: '#087070' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: 'rgba(74, 191, 63, 1)' },
                    { offset: 1, color: 'rgba(14, 123, 59, 1)' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#EFC376' },
                    { offset: 1, color: '#B88A39' },
                  ]),
                },
              },
            ],
          },
        ],
      },
      getData: async () => {
        return await getQtyByClientType({
          auditType: 2,
        })
      },
      dealChartData: (data: any, options: any) => {
        options.yAxis.data = data.map((item: { clientTypeText: any }) => item.clientTypeText)
        options.series[0].data = options.series[0].data.map(
          (item: { value: any }, index: string | number) => {
            item.value = data[index]?.count
            return item
          }
        )
        return options
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
            type: 'shadow',
          },
        },
        grid: {
          top: 30,
          left: '4%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            name: '时间',
            nameGap: 45,
            nameLocation: 'center',
            axisLabel: {
              rotate: 40,
            },
            data: [],
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
              formatter: function (value: number) {
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
            data: [],
          },
        ],
      },
      getData: async () => {
        return await getAuditEventChartInfo({
          auditType: 2,
        })
      },
      dealChartData: (data: any, options: any) => {
        options.xAxis[0].data = data.map((item: any) => item.time.slice(11, 19))
        options.series[0].data = data.map((item: any) => item.count)
        return options
      },
    },
  ],
  sysLogin: [
    {
      tab: '登录',
      key: 'login',
      options: {
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          top: 30,
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          minInterval: 1,
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: [],
        },
        series: [
          {
            name: '登录',
            type: 'bar',
            barWidth: 24, //柱图宽度
            label: {
              show: true,
              position: 'insideLeft',
            },
            data: [
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#E2DE49' },
                    { offset: 1, color: '#667707' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#50DFD4' },
                    { offset: 1, color: '#087070' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: 'rgba(74, 191, 63, 1)' },
                    { offset: 1, color: 'rgba(14, 123, 59, 1)' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#EBBB68' },
                    { offset: 1, color: '#B47D1E' },
                  ]),
                },
              },
            ],
          },
        ],
      },
      getData: async () => {
        return await getQtyByClientType({
          eventType: 1,
        })
      },
      dealChartData: (data: any, options: any) => {
        options.yAxis.data = data.map((item: { clientTypeText: any }) => item.clientTypeText)
        options.series[0].data = options.series[0].data.map(
          (item: { value: any }, index: string | number) => {
            item.value = data[index]?.count
            return item
          }
        )
        return options
      },
    },
    {
      tab: '登录趋势',
      key: 'loginTrend',
      options: {
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: ['管理端', '勘察端', '设计端', '评审端'],
          orient: 'vertical',
          right: 'right',
          top: 60,
        },
        grid: {
          top: 30,
          left: '4%',
          right: '6%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            name: '时间',
            nameGap: 45,
            nameLocation: 'center',
            axisLabel: {
              rotate: 40,
            },
            data: [],
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
              formatter: function (value: number) {
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
            emphasis: {
              focus: 'series',
            },
            data: [],
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
            emphasis: {
              focus: 'series',
            },
            data: [],
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
            emphasis: {
              focus: 'series',
            },
            data: [],
          },
          {
            name: '评审端',
            lineStyle: {
              color: '#ffa726',
              width: 3,
            },
            itemStyle: {
              normal: {
                color: '#ffa726',
              },
            },
            symbol: 'circle',
            symbolRotate: 45,
            showSymbol: true,
            symbolSize: 8,
            type: 'line',
            emphasis: {
              focus: 'series',
            },
            data: [],
          },
        ],
      },
      getData: async () => {
        return await GetLoinoutTrends({
          isLogout: false,
          // queryDate:date
        })
      },
      dealChartData: (data: any, options: any) => {
        options.xAxis[0].data = data[0].trendCharts.map((item: { time: string | any[] }) =>
          item?.time?.slice(11, 19)
        )
        options.series = options.series.map((item: { data: any }, index: string | number) => {
          item.data = data[index]?.trendCharts?.map((value: { count: any }) => value?.count)
          return item
        })
        return options
      },
    },
  ],
  sysExitLogin: [
    {
      tab: '退出登录',
      key: 'exitLogin',
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        animation: false,
        grid: {
          top: 30,
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          minInterval: 1,
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: [],
        },
        series: [
          {
            name: '退出登录',
            type: 'bar',
            barWidth: 24, //柱图宽度
            label: {
              show: true,
              position: 'insideLeft',
            },
            data: [
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#E2DE49' },
                    { offset: 1, color: '#667707' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#50DFD4' },
                    { offset: 1, color: '#087070' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: 'rgba(74, 191, 63, 1)' },
                    { offset: 1, color: 'rgba(14, 123, 59, 1)' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#EBBB68' },
                    { offset: 1, color: '#B47D1E' },
                  ]),
                },
              },
            ],
          },
        ],
      },
      getData: async () => {
        return await getQtyByClientType({
          eventType: 2,
        })
      },
      dealChartData: (data: any, options: any) => {
        options.yAxis.data = data.map((item: { clientTypeText: any }) => item.clientTypeText)
        options.series[0].data = options.series[0].data.map(
          (item: { value: any }, index: string | number) => {
            item.value = data[index]?.count
            return item
          }
        )
        return options
      },
    },
    {
      tab: '退出登录趋势',
      key: 'exitLoginTrend',
      options: {
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: ['管理端', '勘察端', '设计端', '评审端'],
          orient: 'vertical',
          right: 'right',
          top: 60,
        },
        grid: {
          top: 30,
          left: '4%',
          right: '6%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            name: '时间',
            nameGap: 45,
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
              formatter: function (value: number) {
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
            emphasis: {
              focus: 'series',
            },
            data: [737, 88, 11, 888, 590, 50, 77, 20, 2, 22, 444, 790, 453, 783],
          },
          {
            name: '评审端',
            lineStyle: {
              color: '#ffa726',
              width: 3,
            },
            itemStyle: {
              normal: {
                color: '#ffa726',
              },
            },
            symbol: 'circle',
            symbolRotate: 45,
            showSymbol: true,
            symbolSize: 8,
            type: 'line',
            emphasis: {
              focus: 'series',
            },
            data: [],
          },
        ],
      },
      getData: async () => {
        return await GetLoinoutTrends({
          isLogout: true,
        })
      },
      dealChartData: (data: any, options: any) => {
        options.xAxis[0].data = data[0].trendCharts.map((item: { time: string | any[] }) =>
          item?.time?.slice(11, 19)
        )
        options.series = options.series.map((item: { data: any }, index: string | number) => {
          item.data = data[index]?.trendCharts?.map((value: { count: any }) => value?.count)
          return item
        })
        return options
      },
    },
  ],
  sysChangingAccountStatus: [
    {
      tab: '账号状态修改报表',
      key: 'sysChangingAccountStatus',
      options: {
        grid: {
          top: 30,
          left: '4%',
          right: '6%',
          bottom: '0%',
          containLabel: true,
        },
        legend: {
          orient: 'vertical',
          itemWidth: 14,
          right: '35%',
        },
        tooltip: {
          trigger: 'item',
          transitionDuration: 0,
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
              { value: 0, name: '启用' },
              { value: 0, name: '注销' },
              { value: 0, name: '休眠' },
              { value: 0, name: '新建' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            radius: ['15%', '70%'],
          },
        ],
      },

      getData: async () => {
        return await GetAccountChangeEventCount()
      },
      dealChartData: (data: any, options: any) => {
        options.series[0].data = options.series[0].data.map(
          (item: { name: string; value: any }) => {
            if (item.name === '启用') {
              item.value = data.enableAccountCount
            } else if (item.name === '注销') {
              item.value = data.cancelAccountCount
            } else if (item.name === '休眠') {
              item.value = data.dormancyAccountCount
            } else if (item.name === '新建') {
              item.value = data.newAccountCount
            }
            return item
          }
        )
        return options
      },
    },
  ],
  sysChangingPasswordStatus: [
    {
      tab: '密码重置排名',
      key: 'sysChangingAccountStatus',
      options: {
        animation: false,
        grid: {
          top: 30,
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
          data: [],
        },
        series: [
          {
            name: '密码重置排名',
            type: 'bar',
            barWidth: 24, //柱图宽度
            label: {
              show: true,
              position: 'insideLeft',
              color: '#fff',
            },
            data: [
              {
                value: 0,
                itemStyle: {
                  color: '#F17453',
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: '#EE9B48',
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: '#DEC72D',
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: '#A3CC4F',
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: '#61CB92',
                },
              },
            ],
          },
        ],
      },
      getData: async () => {
        return await PassWordRestRank()
      },
      dealChartData: (data: any, options: any) => {
        options.xAxis[0].data = data[0].trendCharts.map((item: { time: string | any[] }) =>
          item?.time?.slice(11, 19)
        )
        options.series[0].data = options.series[0].map((item: { name: string; value: any }) => {
          if (item.name === '启用') {
            item.value = data.enableAccountCount
          } else if (item.name === '注销') {
            item.value = data.cancelAccountCount
          } else if (item.name === '休眠') {
            item.value = data.dormancyAccountCount
          } else if (item.name === '新建') {
            item.value = data.newAccountCount
          }
          return item
        })
        return options
      },
    },
  ],
  sysFileTransfer: [
    {
      tab: '文件传输报表',
      key: 'sysFileTransfer',
      options: {
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          top: 30,
          left: '4%',
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
          minInterval: 1,
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
          data: [],
        },
        series: [
          {
            name: '文件上传',
            type: 'bar',
            barWidth: 14, //柱图宽度
            data: [],
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
            data: [],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                { offset: 0, color: '#3FBF6E' },
                { offset: 1, color: '#0E7B56' },
              ]),
            },
          },
        ],
      },
      getData: async () => {
        return await FileTransferStatisticsAllClient()
      },
      dealChartData: (data: any, options: any) => {
        options.yAxis.data = data.map((item: { key: string }) => item.key)
        options.series[0].data = data.map((item: any) => item.value['文件上传'])
        options.series[1].data = data.map((item: any) => item.value['文件下载'])
        return options
      },
    },
  ],
  sysConnectionTimeout: [
    {
      tab: '连接超时报表',
      key: 'sysConnectionTimeout',
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        animation: false,
        grid: {
          top: 30,
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          minInterval: 1,
        },
        yAxis: {
          type: 'category',
          data: [],
        },
        series: [
          {
            name: '连接超时报表',
            type: 'bar',
            barWidth: 24, //柱图宽度
            label: {
              show: true,
              position: 'insideLeft',
            },
            data: [
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#E2DE49' },
                    { offset: 1, color: '#667707' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#50DFD4' },
                    { offset: 1, color: '#087070' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: 'rgba(74, 191, 63, 1)' },
                    { offset: 1, color: 'rgba(14, 123, 59, 1)' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#EBBB68' },
                    { offset: 1, color: '#B47D1E' },
                  ]),
                },
              },
            ],
          },
        ],
      },
      getData: async () => {
        return await ConnectTimeoutAllClient()
      },
      dealChartData: (data: any, options: any) => {
        options.yAxis.data = data.map((item: { key: string }) => item.key)
        options.series[0].data = options.series[0].data.map(
          (item: { key: string }, index: number) => {
            if (data?.[index]) {
              item['value'] = data[index]['value']
            }
            return item
          }
        )
        return options
      },
    },
  ],
  businessProjectDataChange: [
    {
      tab: '项目数据修改报表',
      key: 'businessProjectDataChange',
      options: {
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          top: 30,
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          minInterval: 1,
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: [],
        },
        series: [
          {
            name: '项目数据修改报表',
            type: 'bar',
            barWidth: 24, //柱图宽度
            label: {
              show: true,
              position: 'insideLeft',
            },
            data: [
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#E2DE49' },
                    { offset: 1, color: '#667707' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#50DFD4' },
                    { offset: 1, color: '#087070' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: 'rgba(74, 191, 63, 1)' },
                    { offset: 1, color: 'rgba(14, 123, 59, 1)' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#EBBB68' },
                    { offset: 1, color: '#B47D1E' },
                  ]),
                },
              },
            ],
          },
        ],
      },
      getData: async () => {
        return await ProjectModifyAllClient()
      },
      dealChartData: (data: any, options: any) => {
        options.yAxis.data = data.map((item: { key: string }) => item.key)
        options.series[0].data = options.series[0].data.map(
          (
            item: {
              value: any
              key: string
            },
            index: number
          ) => {
            if (data[index]) {
              item.value = data[index]['value']
            }
            return item
          }
        )
        return options
      },
    },
  ],
  projectProcessChanges: [
    {
      tab: '项目流程变化报表',
      key: 'projectProcessChanges',
      options: {
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          top: 30,
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          minInterval: 1,
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: [],
        },
        series: [
          {
            name: '项目流程变化报表',
            type: 'bar',
            barWidth: 24, //柱图宽度
            label: {
              show: true,
              position: 'insideLeft',
            },
            data: [
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#E2DE49' },
                    { offset: 1, color: '#667707' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#50DFD4' },
                    { offset: 1, color: '#087070' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: 'rgba(74, 191, 63, 1)' },
                    { offset: 1, color: 'rgba(14, 123, 59, 1)' },
                  ]),
                },
              },
              {
                value: 0,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                    { offset: 0, color: '#EBBB68' },
                    { offset: 1, color: '#B47D1E' },
                  ]),
                },
              },
            ],
          },
        ],
      },
      getData: async () => {
        return await ProjectProcessChangeAllClient()
      },
      dealChartData: (data: any, options: any) => {
        options.yAxis.data = data.map((item: { key: string }) => item.key)
        options.series[0].data = options.series[0].data.map(
          (
            item: {
              value: any
              key: string
            },
            index: number
          ) => {
            if (data[index]) {
              item.value = data[index]['value']
            }
            return item
          }
        )
        return options
      },
    },
  ],
  projectChangeReport: [
    {
      tab: '项目变动报表',
      key: 'projectProcessChanges',
      options: {
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          top: 30,
          left: '4%',
          right: '8%',
          bottom: '6%',
          containLabel: true,
        },
        legend: {
          data: ['成功', '失败'],
          orient: 'vertical',
          right: 'right',
          top: 60,
        },
        xAxis: {
          name: '计数',
          minInterval: 1,
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
          data: [],
        },
        series: [
          {
            name: '成功',
            type: 'bar',
            barWidth: 14, //柱图宽度
            data: [],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                { offset: 0, color: '#5093DF' },
                { offset: 1, color: '#105DCF' },
              ]),
            },
          },
          {
            name: '失败',
            type: 'bar',
            barWidth: 14, //柱图宽度
            data: [],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                { offset: 0, color: '#F8924F' },
                { offset: 1, color: '#F66A3E' },
              ]),
            },
          },
        ],
      },
      getData: async () => {
        return await ProjectChangeAllClient()
      },
      dealChartData: (data: any, options: any) => {
        options.yAxis.data = data.map((item: { key: string }) => item.key)
        options.series[0].data = data.map((item: any) => item.value['成功'])
        options.series[1].data = data.map((item: any) => item.value['失败'])
        return options
      },
    },
  ],
  resourceLibraryChange: [
    {
      tab: '资源库变动报表',
      key: 'projectProcessChanges',
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        animation: false,
        grid: {
          top: 30,
          left: '4%',
          right: '8%',
          bottom: '6%',
          containLabel: true,
        },
        legend: {
          data: ['成功', '失败'],
          orient: 'vertical',
          right: 'right',
          top: 60,
        },
        xAxis: {
          name: '计数',
          minInterval: 1,
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
          data: [],
        },
        series: [
          {
            name: '成功',
            type: 'bar',
            barWidth: 14, //柱图宽度
            data: [],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                { offset: 0, color: '#5093DF' },
                { offset: 1, color: '#1245AB' },
              ]),
            },
          },
          {
            name: '失败',
            type: 'bar',
            barWidth: 14, //柱图宽度
            data: [],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                { offset: 0, color: '#3FBF6E' },
                { offset: 1, color: '#0E7B56' },
              ]),
            },
          },
        ],
      },
      getData: async () => {
        return await ResourceLibChangeAllClient()
      },
      dealChartData: (data: any, options: any) => {
        options.yAxis.data = data.map((item: { key: string }) => item.key)
        options.series[0].data = data.map((item: any) => item.value['成功'])
        options.series[1].data = data.map((item: any) => item.value['失败'])
        return options
      },
    },
  ],
}
