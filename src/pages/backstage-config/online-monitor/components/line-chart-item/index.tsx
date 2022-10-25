import { getOnlineUserQty } from '@/services/backstage-config/online-monitor'
import { useRequest } from 'ahooks'
import * as echarts from 'echarts/lib/echarts'
import React, { useRef, useState } from 'react'
import NumberItem from '../number-item'
import styles from './index.less'
import EnumSelect from '@/components/enum-select'
import { DatePicker, Space, Spin } from 'antd'
import moment from 'moment'

interface ChartParams {
  data?: any
}

enum dateUnit {
  date = '按天展示',
  month = '按月展示',
  year = '按年展示',
}

const getDate = () => {
  const time = new Date()
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const day = time.getDate()
  return { year, month, day }
}

const initParams = {
  year: getDate().year,
  month: 0,
  day: 0,
}

type PickerType = 'date' | 'month' | 'year'

const LineChartItem: React.FC<ChartParams> = (props) => {
  const { data } = props
  const divRef = useRef<HTMLDivElement>(null)
  //日期单位展示
  const [unit, setUnit] = useState<PickerType>('year')
  const [initDate, setInitDate] = useState<any>(initParams)
  // const [dateVal, setDateVal] = useState<Moment>(moment(`${getDate().year}`))
  // const size = useSize(divRef)
  const { data: QtyData, loading } = useRequest(
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
    return {
      tooltip: {
        trigger: 'axis',
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

  /**切换日期查看 */
  const changeDate = (value: any) => {
    const dateArray = moment(value).format('YYYY-MM-DD').split('-')
    setInitDate({
      year: dateArray[0],
      month: unit === 'month' || unit === 'date' ? dateArray[1] : 0,
      day: unit === 'date' ? dateArray[2] : 0,
    })
  }

  const changeDateTypeEvent = (value: PickerType) => {
    setUnit(value)
    switch (value) {
      case 'date':
        setInitDate({
          year: getDate().year,
          month: getDate().month,
          day: getDate().day,
        })
        break
      case 'month':
        setInitDate({
          year: getDate().year,
          month: getDate().month,
          day: 0,
        })
        break
      case 'year':
        setInitDate({
          year: getDate().year,
          month: 0,
          day: 0,
        })
        break

      default:
        break
    }
  }

  return (
    <div className={styles.lineContent}>
      <div className={styles.title}>{data?.clientCategoryText}</div>
      <div className={styles.account}>
        <NumberItem
          size="small"
          account={data?.userTotalQty}
          title={`${data?.clientCategoryText ? data?.clientCategoryText : ' '}权限总数`}
        />
        <NumberItem size="small" account={data?.userOnLineTotalQty} title="当前在线用户数" />
      </div>
      <div className={styles.chart}>
        <div>用户在线时段统计</div>
        <Space>
          <EnumSelect
            valueString
            style={{ width: '120px' }}
            enumList={dateUnit}
            value={unit}
            onChange={(value: any) => changeDateTypeEvent(value)}
          />
          <DatePicker
            // value={dateVal}
            style={{ width: '150px' }}
            picker={unit}
            onChange={(value) => changeDate(value)}
          />
        </Space>
      </div>
      <Spin spinning={loading}>
        <div style={{ width: '100%', height: '435px' }} ref={divRef}></div>
      </Spin>
    </div>
  )
}

export default LineChartItem
