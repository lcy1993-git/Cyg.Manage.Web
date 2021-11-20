import { useSize } from 'ahooks'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import * as echarts from 'echarts/lib/echarts'
import React, { useEffect, useRef } from 'react'

interface BarChartProps {
  options: object
}

const AnnularFighure: React.FC<BarChartProps> = (props) => {
  const { options } = props

  const divRef = useRef<HTMLDivElement>(null)
  let myChart: any = null

  const size = useSize(divRef)

  const initChart = () => {
    if (divRef && divRef.current) {
      myChart = echarts.init((divRef.current as unknown) as HTMLDivElement)
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
        return
      } else {
        resize()
      }
    })

    return () => {
      window.removeEventListener('resize', resize)
    }
  })

  useEffect(() => {
    if (options) {
      initChart()
    }
  }, [JSON.stringify(options), JSON.stringify(size)])

  return <div ref={divRef} style={{ width: '100%', height: '100%' }} />
}

export default AnnularFighure
