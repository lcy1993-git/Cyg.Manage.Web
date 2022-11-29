import { getOnlineUserQty } from '@/services/backstage-config/online-monitor'
import { useRequest } from 'ahooks'
import * as echarts from 'echarts/lib/echarts'
import React, { useEffect, useRef, useState } from 'react'
import NumberItem from '../number-item'
import styles from './index.less'
import EnumSelect from '@/components/enum-select'
import { DatePicker, Space, Spin } from 'antd'
import moment, { Moment } from 'moment'
import ImageIcon from '@/components/image-icon'

interface ChartParams {
  type?: 'all' | 'admin' | 'survey' | 'design' | 'manage'
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
  month: getDate().month,
  day: getDate().day,
}

type PickerType = 'date' | 'month' | 'year'

const LineChartItem: React.FC<ChartParams> = (props) => {
  const { data, type } = props
  const divRef = useRef<HTMLDivElement>(null)
  //日期单位展示
  const [unit, setUnit] = useState<PickerType>('date')
  const [initDate, setInitDate] = useState<any>(initParams)
  const [dateVal, setDateVal] = useState<Moment>(
    moment(`${getDate().year}-${getDate().month}-${getDate().day}`, 'YYYY-MM-DD')
  )
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
      title: {
        text: '单位（个）',
        textStyle: {
          color: '#74AC91',
          fontSize: '12px',
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
          <span style="display:inline-block;margin-right:5px;border-radius:100px;width:10px;height:10px;background-color:#1f9c55"></span><span>在线用户数：</span><span>${data.value}</span>`
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
      },
      series: [
        {
          data: currentDateData,
          type: 'line',
          color: '#1f9c55',
          smooth: true,
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
        },
      ],
    }
  }

  let myChart: any = null
  const initChart = () => {
    if (divRef && divRef.current) {
      myChart = echarts.init(divRef.current as unknown as HTMLDivElement)
      const options = getOptions()
      myChart.setOption(options)
    }
  }

  const resize = () => {
    if (myChart) {
      setTimeout(() => {
        myChart.resize()
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

  /**切换日期查看 */
  const changeDate = (value: any) => {
    setDateVal(value)
    const dateArray = moment(value).format('YYYY-MM-DD').split('-')
    setInitDate({
      year: dateArray[0],
      month: unit === 'month' || unit === 'date' ? dateArray[1] : 0,
      day: unit === 'date' ? dateArray[2] : 0,
    })
  }

  const changeDateTypeEvent = (value: PickerType) => {
    setUnit(value)
    getDefaultDate(value)
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

  //获取默认日期
  const getDefaultDate = (value: PickerType) => {
    switch (value) {
      case 'year':
        setDateVal(moment(getDate().year, 'YYYY'))
        break
      case 'month':
        setDateVal(moment(`${getDate().year}-${getDate().month}`, 'YYYY-MM'))
        break
      case 'date':
        setDateVal(moment(`${getDate().year}-${getDate().month}-${getDate().day}`, 'YYYY-MM-DD'))
        break
      default:
        return
    }
  }

  return (
    <div className={styles.lineContent}>
      <div className={styles.portTitle}>
        <ImageIcon width={25} height={10} imgUrl="monitor/rightArrow.png" />
        <span className={styles.categoryTxt}>{data?.clientCategoryText}</span>
      </div>
      <div className={styles.account}>
        <NumberItem
          account={data?.userTotalQty}
          title={`${data?.clientCategoryText ? data?.clientCategoryText : ' '}权限总数`}
          imgSrc="portTotal.png"
        />
        <NumberItem
          account={data?.userOnLineTotalQty}
          title="当前在线用户数"
          type={type}
          imgSrc="portOnline.png"
        />
      </div>
      <ImageIcon width="100%" height={1} imgUrl="monitor/cutLine.png" />
      <div className={styles.chart}>
        <div>
          <ImageIcon width={4} height={15} imgUrl="monitor/side.png" />
          <span style={{ marginLeft: '10px' }}>用户在线时段统计</span>
        </div>
        <Space>
          <div className={styles.chooseType}>
            <EnumSelect
              valueString
              style={{ width: '105px', height: '25px', color: '@index-to-do-item-color' }}
              enumList={dateUnit}
              value={unit}
              onChange={(value: any) => changeDateTypeEvent(value)}
              bordered={false}
            />
          </div>
          <div className={styles.chooseTime}>
            <DatePicker
              style={{ width: '105px' }}
              picker={unit}
              value={dateVal}
              onChange={(value) => changeDate(value)}
              allowClear={false}
              bordered={false}
            />
          </div>
        </Space>
      </div>
      <Spin spinning={loading}>
        <div style={{ width: '100%', height: '100%' }} ref={divRef}></div>
      </Spin>
    </div>
  )
}

export default LineChartItem
