import { getQtyByArea, getQtyByState } from '@/services/backstage-config/online-monitor'
import { LeftOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Spin } from 'antd'
import * as echarts from 'echarts/lib/echarts'
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import styles from './index.less'

interface ChartParams {
  data?: any
  setArea?: Dispatch<SetStateAction<string>>
  setShowName?: Dispatch<SetStateAction<string>>
  showName?: string
  area: string
  type: 'area' | 'state'
}
let myChart: any = null
let stateChart: any = null
const BarChartItem: React.FC<ChartParams> = (props) => {
  const { setArea, area, type, showName, setShowName } = props
  const divRef = useRef<HTMLDivElement>(null)

  // const

  const { data: QtyData, loading } = useRequest(() => getQtyByArea({ areaCode: area }), {
    ready: type === 'area',
    onSuccess: () => {
      if (QtyData.length) {
        initChart()
      }
    },
    refreshDeps: [area],
  })

  //获取项目状态数量
  const { data: stateData, loading: stateLoading } = useRequest(
    () => getQtyByState({ areaCode: area }),
    {
      ready: type === 'state',
      onSuccess: () => {
        initChart()
      },
      refreshDeps: [area],
    }
  )

  myChart?.on('click', (e: any) => {
    setArea?.(e.data?.areaCode)
    setShowName?.(e.name)
  })

  const getOptions = () => {
    const areaDat =
      type === 'area'
        ? QtyData?.map((item: any) => item.area.text)
        : stateData?.map((item: any) => item.key)
    const valueDat =
      type === 'area'
        ? QtyData.map((item: any) => {
            return { value: item.qty, areaCode: item.area.value }
          })
        : stateData.map((item: any) => item.value)
    return {
      title: {
        text: '单位（个）',
        textStyle: {
          color: '#74AC91',
          fontSize: '12px',
        },
      },
      xAxis: {
        axisLabel: {
          show: true,
          interval: 0,
        },
        axisLine: {
          lineStyle: {
            color: '#74AC91',
          },
        },
        data: areaDat,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#74AC91',
        },
        splitLine: {
          lineStyle: {
            color: '#74AC91',
            type: 'dashed',
          },
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter(params: any) {
          const data = params[0]
          return `<span>${data.name}</span><br />
          <span style="display:inline-block;margin-right:5px;border-radius:100px;width:10px;height:10px;background-color:#1f9c55"></span><span>项目数量：</span><span>${data.value}</span>`
        },
      },
      dataGroupId: '',
      animationDurationUpdate: 500,
      series: {
        color: '#1f9c55',
        type: 'bar',
        id: 'areaCode',
        data: valueDat,
        universalTransition: {
          enabled: true,
          divideShape: 'clone',
        },
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              1,
              0,
              0,
              [
                {
                  offset: 0,
                  color: 'rgba(77, 169, 68, 0.9)', // 0% 处的颜色
                },
                {
                  offset: 0.6,
                  color: 'rgba(77, 169, 68, 0.7)', // 60% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(77, 169, 68, 0.5)', // 100% 处的颜色
                },
              ],
              false
            ),
          },
        },
      },
    }
  }

  const initChart = () => {
    if (divRef && divRef.current) {
      if (type === 'area') {
        myChart = echarts.init(divRef.current as unknown as HTMLDivElement)
        const options = getOptions()
        myChart.setOption(options)
        return
      }
      stateChart = echarts.init(divRef.current as unknown as HTMLDivElement)
      const options = getOptions()
      stateChart.setOption(options)
    }
  }

  const resize = () => {
    if (myChart) {
      setTimeout(() => {
        myChart.resize()
      }, 100)
    }
    if (stateChart) {
      setTimeout(() => {
        stateChart.resize()
      }, 100)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (!divRef.current) {
        // 如果切换到其他页面，这里获取不到对象，删除监听。否则会报错
        window.removeEventListener('resize', resize)
      } else {
        resize()
      }
    })

    return () => {
      window.removeEventListener('resize', resize)
    }
  })

  const backEvent = () => {
    setArea?.('')
    setShowName?.('')
  }

  return (
    <div className={styles.barContent}>
      {area && type === 'area' && (
        <LeftOutlined
          onClick={() => backEvent()}
          style={{ fontSize: '20px', color: '#1f9c55', width: '5%', marginBottom: '10px' }}
          title="返回顶层"
        />
      )}
      {showName && type === 'state' && <div className={styles.barTitle}>{showName}</div>}
      <Spin spinning={type === 'area' ? loading : stateLoading}>
        <div style={{ width: '100%', height: '100%' }} ref={divRef}></div>
      </Spin>
      <div className={styles.barTitle}>{type === 'area' ? '项目数量统计' : '项目状态数量统计'}</div>
    </div>
  )
}

export default BarChartItem
