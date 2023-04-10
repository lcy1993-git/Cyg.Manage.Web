import React, { useCallback, useEffect, useRef, useState } from 'react'
import WrapperComponent from '@/components/page-common-wrap'
import EventNumber from '@/pages/adminIndex/home/child/eventsNumber'
import styles from './index.less'
import * as echarts from 'echarts'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import { useMount } from 'ahooks'
import RecentlyWarned from '@/pages/adminIndex/home/child/recentlyWarned'
import { Button, Spin, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { useHistory } from 'react-router-dom'
import {
  getAuditEventCategoryQty,
  getAuditEventChartInfo,
  getAuditEventQtyInfo,
} from '@/services/security-audit'

const AdminIndex: React.FC = () => {
  const lineRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const [spinning, setSpinning] = useState(false)
  const [circleData, setCilcleData] = useState([
    {
      name: '业务事件',
      value: 0,
    },
    {
      name: '系统事件',
      value: 0,
    },
  ])
  const [lineDataArr, setLineDataArr] = useState<
    {
      time: string
      count: number
    }[]
  >([])
  const [tableData, setTableData] = useState([])
  const getCountData = async () => {
    const res = await getAuditEventQtyInfo()
    const lineData = await getAuditEventChartInfo({
      hour: 12,
    })
    setLineDataArr(lineData)
    if (res) {
      setCilcleData([
        {
          name: '业务事件',
          value: res.businessQty,
        },
        {
          name: '系统事件',
          value: res.systemQty,
        },
      ])
    }
    setSpinning(false)
    setTimeout(() => {
      setSpinning(false)
    }, 5000)
  }
  const getTableData = async () => {
    const res = await getAuditEventCategoryQty()
    setTableData(res)
  }
  useMount(() => {
    setSpinning(true)
    getCountData().then(() => {})
    getTableData().then(() => {})
  })
  let myChartLine: any = null
  let myChartCircle: any = null
  const history = useHistory()
  const lineOptions = {
    title: {
      text: '日志趋势',
      textStyle: {
        fontSize: 16,
        fontWeight: 500,
        color: '#1f1f1f',
        fontFamily: 'Source Han Sans CN',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
    },
    grid: {
      left: '4%',
      right: '1%',
      bottom: '5%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        name: '时间',
        nameGap: 50,
        nameLocation: 'center',
        axisLabel: {
          rotate: 40,
        },
        data: lineDataArr.map((i) => i.time.slice(10, 20).replace(' ', '')),
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
        // stack: 'Total',
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
        data: lineDataArr.map((i) => i.count),
      },
    ],
  }
  const circleOptions = {
    title: {
      text: '事件比例',
      left: 'left',
      textStyle: {
        fontSize: 16,
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: 'item',
      transitionDuration: 0,
    },
    color: ['rgba(22, 147, 125, 1)', 'rgba(53, 131, 222, 1)'],
    series: [
      {
        radius: ['20%', '70%'],
        type: 'pie',
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1,
        },
        data: circleData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      index: 'index',
      width: 70,
      ellipsis: true,
      render: (text: string, record: any, index: number) => {
        return <span>{index + 1}</span>
      },
    },
    {
      title: '报表名称',
      dataIndex: 'eventTypeText',
      width: '70%',
    },
    {
      title: '计数',
      dataIndex: 'count',
    },
    {
      title: '操作',
      dataIndex: 'tags',
      render: (text: any, record: any) => {
        return (
          <Button
            type={'link'}
            onClick={() => showReport(record)}
            style={{
              color: '#0076FF',
            }}
          >
            <span style={{ textDecoration: 'underline' }}>查看报表</span>
          </Button>
        )
      },
    },
  ]
  const showReport = (row: { eventType: number }) => {
    history.push(`/admin-index/report/${row.eventType}`)
  }
  const initChart = useCallback(() => {
    if (lineRef && lineRef.current) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      myChartLine = echarts.init(lineRef.current as unknown as HTMLDivElement)
      myChartLine.setOption(lineOptions)
    }
    if (circleRef && circleRef.current) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      myChartCircle = echarts.init(circleRef.current as unknown as HTMLDivElement)
      myChartCircle.setOption(circleOptions)
    }
  }, [circleData])
  const resize = () => {
    if (myChartCircle) {
      myChartCircle.resize()
    }
    if (myChartLine) {
      myChartLine.resize()
    }
  }
  useEffect(() => {
    window.addEventListener('resize', () => {
      if (!lineRef.current) {
        // 如果切换到其他页面，这里获取不到对象，删除监听。否则会报错
        window.removeEventListener('resize', resize)
        return
      } else {
        resize()
      }
    })
    window.removeEventListener('resize', resize)
  })
  useEffect(() => {
    initChart()
  }, [circleData, initChart, lineDataArr])
  useMount(() => {
    initChart()
  })
  return (
    <WrapperComponent noColor={true} noPadding={true}>
      <Spin tip="加载中..." spinning={spinning}>
        <div className={styles.indexBack}>
          <EventNumber system={circleData[1].value} business={circleData[0].value} />
          <div className={styles.mainInfo}>
            <div className={styles.leftContent}>
              <div className={styles.leftContentTop}>
                <div className={styles.lineChart}>
                  <div ref={lineRef} style={{ width: '100%', height: '100%' }} />
                </div>
                <div className={styles.circleChart}>
                  <div ref={circleRef} style={{ width: '100%', height: '100%' }} />
                </div>
              </div>
              <div className={styles.leftTable}>
                <div className={styles.tableTitle}>安全事件</div>
                <div className={styles.tableBox}>
                  <Table
                    // @ts-ignore
                    columns={columns as ColumnsType}
                    bordered
                    size={'small'}
                    pagination={false}
                    scroll={{
                      y: '28vh',
                    }}
                    dataSource={tableData}
                  />
                </div>
              </div>
            </div>
            <div className={styles.RightContent}>
              <RecentlyWarned />
            </div>
          </div>
        </div>
      </Spin>
    </WrapperComponent>
  )
}

export default AdminIndex
