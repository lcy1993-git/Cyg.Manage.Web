import React, { useState, useMemo, useRef, useEffect } from 'react'
import { CaretDownOutlined } from '@ant-design/icons'
import { Select, Spin } from 'antd'
import ChartBox from '../chart-box'
import borderStylesHTML from '../../utils/borderStylesHTML'

import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'

import styles from './index.less'
import useRequest from '@ahooksjs/use-request'
import { AreaInfo, getProjectNumberData } from '@/services/index'
import moment from 'moment'
import { useSize } from 'ahooks'

const { Option } = Select

interface ProjectNumberProps {
  componentProps?: string[]
  currentAreaInfo: AreaInfo
}

const ProjectNumber: React.FC<ProjectNumberProps> = (props) => {
  const [searchType, setSearchType] = useState<string>('0')
  const divRef = useRef<HTMLDivElement>(null)
  const size = useSize(divRef)
  const { currentAreaInfo } = props
  const componentProps = ['14', '1', '2', '3', '4', '19']
  const { data = [], loading } = useRequest(
    () =>
      getProjectNumberData({
        areaCode: currentAreaInfo.areaId,
        areaType: currentAreaInfo.areaLevel,
        category: searchType,
      }),
    {
      refreshDeps: [searchType, currentAreaInfo],
      onSuccess: () => {
        initChart()
      },
    }
  )

  let myChart: any = null

  const getOptions = () => {
    const dateData = data.map((item) => moment(item.key).format('MM月DD日')).reverse()
    const currentDateData = data.map((item) => item.value.qty).reverse()
    const changeDateData = data.map((item) => item.value.qty - item.value.yesterdayQty).reverse()
    return {
      grid: {
        top: 20,
        bottom: 40,
        right: 30,
        left: 60,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.9)',
        borderColor: '#000',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          const { dataIndex } = params[0]

          const currentData = currentDateData[dataIndex] ?? 0
          const currentChangeData = changeDateData[dataIndex] ?? 0
          const arrow = currentChangeData === 0 ? '' : currentChangeData > 0 ? '↑' : '↓'
          // 删掉时间
          // <span style="font-size: 14px; font-weight: 600; color: #fff">${thisTime}</span><br />
          return `${borderStylesHTML}

                <span style="color: #fff"><span style="color: #2AFE97">当前项目数：</span>${currentData}</span><br />
                <span style="color: #fff"><span style="color: #2AFE97">较昨日变化：</span>${arrow}${Math.abs(
            currentChangeData
          )}</span>
              `
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

  const initChart = () => {
    if (divRef && divRef.current) {
      myChart = echarts.init((divRef.current as unknown) as HTMLDivElement)
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
    if (size.width || size.height) {
      const myEvent = new Event('resize')
      window.dispatchEvent(myEvent)
    }
  }, [JSON.stringify(size)])

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

  return (
    <ChartBox title="项目数量">
      <Spin delay={300} spinning={loading}>
        <div className={styles.typeSelect}>
          <Select
            bordered={false}
            defaultValue={searchType}
            suffixIcon={<CaretDownOutlined />}
            onChange={(v) => setSearchType(v)}
          >
            <Option value="0">全部</Option>
            {componentProps.includes('14') && <Option value="14">待安排</Option>}
            {componentProps.includes('1') && <Option value="1">未勘察</Option>}
            {componentProps.includes('2') && <Option value="2">勘察中</Option>}
            {componentProps.includes('3') && <Option value="3">已勘察</Option>}
            {componentProps.includes('4') && <Option value="4">设计中</Option>}
            {componentProps.includes('19') && <Option value="19">已设计</Option>}
          </Select>
        </div>
        <div className={styles.chartContent}>
          <div style={{ width: '100%', height: '100%' }} ref={divRef}></div>
        </div>
      </Spin>
    </ChartBox>
  )
}

export default ProjectNumber
