import {
  getOnlineUserQty,
  getQtyByArea,
  getQtyByState,
} from '@/services/backstage-config/online-monitor'
import { useRequest } from 'ahooks'
import * as echarts from 'echarts/lib/echarts'
import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import styles from './index.less'

interface ChartParams {
  data?: any
  setArea?: Dispatch<SetStateAction<string>>
  area: string
}
let myChart: any = null
const BarChartItem: React.FC<ChartParams> = (props) => {
  const { data, setArea, area } = props
  const divRef = useRef<HTMLDivElement>(null)
  const [drillData, setDrillData] = useState<any>([])
  // const

  const { data: QtyData } = useRequest(() => getQtyByArea({ areaCode: area }), {
    onSuccess: () => {
      const handleData = QtyData?.map((item: any) => {
        return { upCode: area, data: [item.area.text, item.qty] }
      })
      setDrillData(handleData)
      initChart()
    },
    refreshDeps: [area],
  })

  // const { data: stateData } = useRequest(() => getQtyByState({ areaCode: '' }), {
  //   onSuccess: () => {
  //     const handleData = QtyData?.map((item: any) => {
  //       return { key: item.area.text, value: item.qty }
  //     })
  //     setBarData(handleData)
  //     initChart()
  //   },
  // })

  myChart?.on('click', (e: any) => {
    setArea?.(e.data?.areaCode)

    if (e.data) {
      var subData = drillData.find((data: any) => {
        return data.upCode === e.data.areaCode
      })
      if (!subData) {
        return
      }

      myChart.setOption({
        xAxis: {
          data: subData.data.map((item: any) => {
            return item[0]
          }),
        },
        series: {
          type: 'bar',
          id: 'area',
          dataGroupId: subData.dataGroupId,
          data: subData.data.map((item: any) => {
            return item[1]
          }),
          universalTransition: {
            enabled: true,
            divideShape: 'clone',
          },
        },
        graphic: [
          {
            type: 'text',
            left: 50,
            top: 20,
            style: {
              text: 'Back',
              fontSize: 18,
            },
            onclick: initChart(),
          },
        ],
      })
    }
  })

  const getOptions = () => {
    // if(DrillData.length )
    const areaDat = QtyData?.map((item: any) => item.area.text)
    const valueDat = QtyData.map((item: any) => {
      return { value: item.qty, areaCode: item.area.value }
    })
    return {
      xAxis: {
        data: areaDat,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#74AC91',
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
      myChart = echarts.init((divRef.current as unknown) as HTMLDivElement)
      const options = getOptions()
      myChart.setOption(options)
    }
  }

  const backEvent = () => {}

  return (
    <div className={styles.lineContent}>
      <div className={styles.title}>{data?.clientCategoryText}</div>

      <div className={styles.chart}>
        <div style={{ width: '100%', height: '580px' }} ref={divRef}></div>
        {/* <div onClick={() => backEvent()}>back</div> */}
      </div>
    </div>
  )
}

export default BarChartItem
