import { getOnlineUserQty } from '@/services/backstage-config/online-monitor'
import { useRequest } from 'ahooks'
import * as echarts from 'echarts/lib/echarts'
import React, { useRef } from 'react'
import NumberItem from '../number-item'
import styles from './index.less'

interface ChartParams {
  data?: any
}

const LineChartItem: React.FC<ChartParams> = (props) => {
  const { data } = props
  const divRef = useRef<HTMLDivElement>(null)
  // const size = useSize(divRef)
  const { data: QtyData } = useRequest(
    () =>
      getOnlineUserQty({
        clientCategory: data && data?.clientCategory,
        year: 2022,
        month: 0,
        day: 0,
      }),
    {
      ready: !!data,
      onSuccess: () => {
        initChart()
      },
    }
  )

  const getOptions = () => {
    const dateData = QtyData?.map((item: any) => item.key)
    const currentDateData = QtyData.map((item: any) => item.value)
    // const changeDateData = data.map((item) => item.value.qty - item.value.yesterdayQty).reverse()
    return {
      // dataZoom: {
      //   show: true,
      //   realtime: true,
      //   y: 36,
      //   height: 2,
      //   start: 20,
      //   end: 80,
      // },
      // grid: {
      //   top: 20,
      //   bottom: 40,
      //   right: 30,
      //   left: 60,
      // },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.9)',
        borderColor: '#000',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          color: '#74AC91',
        },
        axisLine: {
          lineStyle: {
            color: '#74AC91',
          },
        },
        data: dateData,
      },
      yAxis: {
        type: 'value',
        splitNumber: 5,
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
      series: [
        {
          data: currentDateData,
          type: 'line',
          color: '#2AFE97',
        },
      ],
    }
  }

  let myChart: any = null
  const initChart = () => {
    if (divRef && divRef.current) {
      myChart = echarts.init((divRef.current as unknown) as HTMLDivElement)
      const options = getOptions()
      myChart.setOption(options)
    }
  }

  return (
    <div className={styles.lineContent}>
      <div className={styles.title}>{data?.clientCategoryText}</div>
      <div className={styles.account}>
        <NumberItem
          size="small"
          account={data?.userTotalQty}
          title={`${data?.clientCategoryText}权限总数`}
        />
        <NumberItem size="small" account={data?.userOnlineTotalQty} title="当前在线用户数" />
      </div>
      <div className={styles.chart}>用户在线时段统计</div>
      <div style={{ width: '100%', height: '420px' }} ref={divRef}></div>
    </div>
  )
}

export default LineChartItem
