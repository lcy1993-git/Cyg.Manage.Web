import { getQtyByArea, getQtyByState } from '@/services/backstage-config/online-monitor'
import { LeftOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Spin } from 'antd'
import * as echarts from 'echarts/lib/echarts'
import React, { Dispatch, SetStateAction, useRef } from 'react'
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
      // const handleData = QtyData?.map((item: any) => {
      //   return { upCode: area, data: [item.area.text, item.qty] }
      // })
      // setDrillData(handleData)
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
      xAxis: {
        axisLabel: {
          show: true,
          interval: 0,
        },
        data: areaDat,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#74AC91',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
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
      },
    }
  }

  const initChart = () => {
    if (divRef && divRef.current) {
      if (type === 'area') {
        myChart = echarts.init((divRef.current as unknown) as HTMLDivElement)
        const options = getOptions()
        myChart.setOption(options)
        return
      }
      stateChart = echarts.init((divRef.current as unknown) as HTMLDivElement)
      const options = getOptions()
      stateChart.setOption(options)
    }
  }

  const backEvent = () => {
    setArea?.('')
    setShowName?.('')
  }

  return (
    <div className={styles.barContent}>
      {area && type === 'area' && (
        <LeftOutlined
          onClick={() => backEvent()}
          style={{ fontSize: '20px', color: '#1f9c55', width: '5%' }}
          title="返回顶层"
        />
      )}
      {showName && type === 'state' && <div className={styles.barTitle}>{showName}</div>}
      <Spin spinning={type === 'area' ? loading : stateLoading}>
        <div style={{ width: '95%', height: '580px' }} ref={divRef}></div>
      </Spin>
      <div className={styles.barTitle}>{type === 'area' ? '项目数量统计' : '项目状态数量统计'}</div>
    </div>
  )
}

export default BarChartItem
