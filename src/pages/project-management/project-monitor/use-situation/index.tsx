import BarChart from '@/components/bar-chart'
import GeneralTable from '@/components/general-table'
import ChartBox from '@/pages/index/components/chart-box'
import { CaretDownOutlined } from '@ant-design/icons'
import { useUpdateEffect } from 'ahooks'
import { Button, DatePicker, Select, Spin } from 'antd'
import moment, { Moment } from 'moment'
import React, { useMemo, useRef, useState } from 'react'
import { useProMonitorStore } from '../context'
import styles from '../project-situation/index.less'

const { Option } = Select

const { RangePicker } = DatePicker

const UseSituation: React.FC = () => {
  const [startTime, setStartTime] = useState<Moment | string | null>(null)
  const [endTime, setEndTime] = useState<Moment | null | string>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const [chartTableData, setChartTableData] = useState<any>()

  const { setStartDate, setEndDate } = useProMonitorStore()

  //阶段选择
  const [stage, setStage] = useState<number>(2)

  //表格柱状图切换
  const [showType, setShowType] = useState<string>('table')

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      index: 'index',
      render: (text: string, record: any, index: number) => {
        return <span>{index + 1}</span>
      },
    },
    {
      title: '单位',
      index: 'creationName',
      dataIndex: 'creationName',
    },
    {
      title: '设计单位',
      index: 'executionName',
      dataIndex: 'executionName',
    },
    {
      title: '待安排',
      index: 'qty1',
      dataIndex: 'qty1',
    },
    {
      title: '未勘察',
      index: 'qty2',
      dataIndex: 'qty2',
    },
    {
      title: '勘察中',
      index: 'qty3',
      dataIndex: 'qty3',
    },
    {
      title: '已勘察',
      index: 'qty4',
      dataIndex: 'qty4',
    },
    {
      title: '设计中',
      index: 'qty5',
      dataIndex: 'qty5',
    },
    {
      title: '设计完成',
      index: 'qty6',
      dataIndex: 'qty6',
    },
    {
      title: '已提交',
      index: 'qty7',
      dataIndex: 'qty7',
    },
  ]

  const option = useMemo(() => {
    // const colors = ['#5470C6', '#91CC75', '#EE6666']
    if (chartTableData) {
      const companyList = chartTableData?.map((item: any) => item.executionName)
      const qty1 = chartTableData?.map((item: any) => item.qty1)
      const qty2 = chartTableData?.map((item: any) => item.qty2)
      const qty3 = chartTableData?.map((item: any) => item.qty3)
      const qty4 = chartTableData?.map((item: any) => item.qty4)
      const qty5 = chartTableData?.map((item: any) => item.qty5)
      const qty6 = chartTableData?.map((item: any) => item.qty6)
      const qty7 = chartTableData?.map((item: any) => item.qty7)

      return {
        grid: {
          left: 50,
          bottom: 30,
          top: 60,
          containLabel: true,
        },
        legend: {
          data: ['待安排', '未勘察', '勘察中', '已勘察', '设计中', '设计完成', '已提交'],
          x: 'center',
          itemGap: 20,
          textStyle: {
            color: '#2afe97',
          },
        },
        dataZoom: [
          {
            // 设置滚动条的隐藏与显示
            show: true,
            // 设置滚动条类型
            type: 'slider',
            // 设置背景颜色
            backgroundColor: 'rgb(36, 87, 66)',
            // 设置选中范围的填充颜色
            fillerColor: 'rgb(42, 254, 144)',
            // 设置边框颜色
            borderColor: 'rgb(36, 87, 66)',
            // 是否显示detail，即拖拽时候显示详细数值信息
            showDetail: false,
            // 数据窗口范围的起始数值
            startValue: 0,
            // 数据窗口范围的结束数值（一页显示多少条数据）
            endValue: 6,
            // empty：当前数据窗口外的数据，被设置为空。
            // 即不会影响其他轴的数据范围
            filterMode: 'empty',
            // 设置滚动条宽度，相对于盒子宽度
            width: '80%',
            // 设置滚动条高度
            height: 2,
            // 设置滚动条显示位置
            left: 'center',
            // 是否锁定选择区域（或叫做数据窗口）的大小
            zoomLoxk: true,
            // 控制手柄的尺寸
            handleSize: 0,
            // dataZoom-slider组件离容器下侧的距离
            bottom: 3,
          },
          {
            // 没有下面这块的话，只能拖动滚动条，
            // 鼠标滚轮在区域内不能控制外部滚动条
            type: 'inside',
            // 滚轮是否触发缩放
            zoomOnMouseWheel: false,
            // 鼠标滚轮触发滚动
            moveOnMouseMove: true,
            moveOnMouseWheel: true,
          },
        ],
        tooltip: {
          trigger: 'axis',
          confine: true,
          axisPointer: {
            type: 'shadow',
          },
          textStyle: {
            color: '#fff',
          },
          backgroundColor: 'rgba(0,0,0,0.9)',
          borderColor: '#000',
        },
        xAxis: {
          data: companyList,
          type: 'category',

          axisLine: {
            show: true,
            lineStyle: {
              color: '#74AC91',
            },
          },
          axisLabel: {
            interval: 0, //全部显示x轴
            rotate: 20,
            textStyle: {
              color: '#2afe97',
            },
            lineStyle: {
              color: '#2afe97',
            },
          },
          splitLine: {
            lineStyle: {
              color: '#355345',
              type: 'dashed',
            },
          },
        },
        yAxis: {
          type: 'value',
          name: '项目数量/个',
          nameTextStyle: {
            color: '#2afe97',
            fontSize: 14,
          },
          minInterval: 1,
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#167a50',
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#74AC91',
              type: 'dashed',
            },
          },
          axisLabel: {
            color: '#2afe97',
            formatter: '{value} ',
          },
        },

        series: [
          {
            name: '待安排',
            type: 'bar',
            data: qty1,
            itemStyle: {
              normal: {
                color: '#778899',
              },
            },
          },
          {
            name: '未勘察',
            type: 'bar',
            data: qty2,
            itemStyle: {
              normal: {
                color: '#AFEEEE',
              },
            },
          },
          {
            name: '勘察中',
            type: 'bar',
            data: qty3,
            itemStyle: {
              normal: {
                color: '#00CED1',
              },
            },
          },
          {
            name: '已勘察',
            type: 'bar',
            data: qty4,
            itemStyle: {
              normal: {
                color: '#1e90ff',
              },
            },
          },
          {
            name: '设计中',
            type: 'bar',
            data: qty5,
            itemStyle: {
              normal: {
                color: '#eee8aa',
              },
            },
          },
          {
            name: '设计完成',
            type: 'bar',
            data: qty6,
            itemStyle: {
              normal: {
                color: '#ffd700',
              },
            },
          },
          {
            name: '已提交',
            type: 'bar',
            data: qty7,
            itemStyle: {
              normal: {
                color: '#ba55d3',
              },
            },
          },
        ],
      }
    }
    return {}
  }, [chartTableData])

  const reset = () => {
    setStartTime(null)
    setEndTime(null)
  }

  const searchByParams = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.searchByParams({
        startDate: startTime,
        endDate: endTime,
        stage: stage,
      })
    }
  }

  useUpdateEffect(() => {
    searchByParams()
  }, [JSON.stringify(startTime), JSON.stringify(endTime), stage])

  const changeToChart = (value: any) => {
    setShowType(value)
  }

  const changeStage = (value: any) => {
    setStage(value)
  }

  return (
    <ChartBox title="云平台应用情况">
      <Spin delay={300} spinning={!chartTableData && chartTableData !== undefined}>
        <div className={styles.monitorManage}>
          <div className={styles.monitorCondition}>
            <div className={styles.monitorSelect}>
              <Select
                bordered={false}
                value={showType}
                suffixIcon={<CaretDownOutlined />}
                onChange={(value: any) => changeToChart(value)}
              >
                <Option value="table">表格</Option>
                <Option value="chart">柱状图</Option>
              </Select>
            </div>

            {showType === 'table' && (
              <div className={styles.monitorTime}>
                <span className={styles.monitorChooseLabel}>阶段选择</span>
                <div className={styles.monitorSelect}>
                  <Select
                    bordered={false}
                    value={stage}
                    suffixIcon={<CaretDownOutlined />}
                    onChange={(value: any) => changeStage(value)}
                  >
                    <Option value={2}>可研</Option>
                    <Option value={3}>初设</Option>
                  </Select>
                </div>
                <span className={styles.monitorChooseLabel}>选择日期</span>
                <div className={styles.monitorChooseTime}>
                  <RangePicker
                    format="YYYY-MM-DD"
                    allowClear={false}
                    value={[startTime ? moment(startTime) : null, endTime ? moment(endTime) : null]}
                    onChange={(dates, dateStrings) => {
                      setStartTime(dateStrings[0])
                      setStartDate(dateStrings[0])
                      setEndTime(dateStrings[1])
                      setEndDate(dateStrings[1])
                    }}
                    bordered={false}
                    renderExtraFooter={() => [
                      <Button key="clearDate" onClick={() => reset()}>
                        清除日期
                      </Button>,
                    ]}
                  />
                </div>
              </div>
            )}
          </div>
          {showType === 'table' ? (
            <div className={styles.table}>
              <GeneralTable
                getTableRequestData={setChartTableData}
                noPaging
                rowKey="index"
                notShowSelect
                ref={tableRef}
                size="small"
                columns={columns}
                url="/Hotfix230908/GetQtyByExecutionIdentity"
                extractParams={{ startDate: startTime, endDate: endTime, stage: stage }}
                scroll={{ y: 'calc(98vh - 430px)' }}
              />
            </div>
          ) : (
            <div className={styles.monitorChart}>{<BarChart options={option} />}</div>
          )}
        </div>
      </Spin>
    </ChartBox>
  )
}

export default UseSituation
