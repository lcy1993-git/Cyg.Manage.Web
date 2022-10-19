import { getOnlineUserQty } from '@/services/backstage-config/online-monitor'
import { useRequest } from 'ahooks'
import * as echarts from 'echarts/lib/echarts'
import React, { useRef, useState } from 'react'
import NumberItem from '../number-item'
import styles from './index.less'
import EnumSelect from '@/components/enum-select'

interface ChartParams {
  data?: any
}

enum dateUnit {
  '按天展示' = 1,
  '按月展示' = 2,
  '按年展示' = 3,
}

const initParams = {
  year: 2022,
  month: 0,
  day: 0,
}

const LineChartItem: React.FC<ChartParams> = (props) => {
  const { data } = props
  const divRef = useRef<HTMLDivElement>(null)
  //日期单位展示
  const [unit, setUnit] = useState<string>('3')
  const [initDate, setInitDate] = useState<any>(initParams)
  // const size = useSize(divRef)
  const { data: QtyData } = useRequest(
    () =>
      getOnlineUserQty({
        clientCategory: data && data?.clientCategory,
        ...initDate,
      }),
    {
      ready: !!data,
      onSuccess: () => {
        initChart()
      },
      refreshDeps: [initDate],
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
        splitNumber: 6,
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
          color: '#1f9c55',
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

  /**切换日期类型查看 */
  const searchChange = (value: string) => {
    setUnit(value)
    const time = new Date()
    const year = time.getFullYear()
    const month = time.getMonth() + 1
    const day = time.getDate()
    setInitDate({
      year: year,
      month: value === '2' || value === '1' ? month : 0,
      day: value === '1' ? day : 0,
    })
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
      <div className={styles.chart}>
        <div>用户在线时段统计</div>
        <EnumSelect
          style={{ width: '120px' }}
          enumList={dateUnit}
          value={unit}
          onChange={(value: any) => searchChange(value)}
        />
      </div>
      <div style={{ width: '100%', height: '435px' }} ref={divRef}></div>
    </div>
  )
}

export default LineChartItem
