import BarChart from '@/components/bar-chart'
import GeneralTable from '@/components/general-table'
import ChartBox from '@/pages/index/components/chart-box'
import { CaretDownOutlined } from '@ant-design/icons'
import { Button, DatePicker, Select, Spin } from 'antd'
import moment, { Moment } from 'moment'
import React, { useMemo, useRef, useState } from 'react'
import styles from './index.less'

const { Option } = Select

const { RangePicker } = DatePicker

interface DeliveyManageProps {
  componentProps?: string[]
}

const ProjectSituation: React.FC<DeliveyManageProps> = () => {
  const [startTime, setStartTime] = useState<Moment | string | null>(null)
  const [endTime, setEndTime] = useState<Moment | null | string>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const [chartTableData, setChartTableData] = useState<any>()

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
      index: 'companyName',
      dataIndex: 'companyName',
    },
    {
      title: '竣工项目数量',
      index: 'qty',
      dataIndex: 'qty',
    },
    {
      title: '总项目数量',
      index: 'totalQty',
      dataIndex: 'totalQty',
    },
    {
      title: '新增完成项目数量',
      index: 'newQty',
      dataIndex: 'newQty',
    },
    {
      title: '实际完成率（%）',
      index: 'completionRate',
      dataIndex: 'completionRate',
    },
  ]

  const option = useMemo(() => {
    // const colors = ['#5470C6', '#91CC75', '#EE6666']
    if (chartTableData) {
      const companyList = chartTableData?.map((item: any) => item.companyName)
      const jgQty = chartTableData?.map((item: any) => item.qty)
      const totalQty = chartTableData?.map((item: any) => item.totalQty)
      const newQty = chartTableData?.map((item: any) => item.newQty)
      const rateData = chartTableData?.map((item: any) => item.completionRate)

      return {
        grid: {
          left: 60,
          bottom: 30,
          top: 50,
          containLabel: true,
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
            endValue: 9,
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
        yAxis: [
          {
            type: 'value',
            name: '完成数量/次',
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
          {
            type: 'value',
            name: '完成率(%)',
            nameTextStyle: {
              color: '#2afe97',
              fontSize: 14,
            },

            position: 'right',
            alignTicks: true,
            splitLine: {
              show: false,
              lineStyle: {
                color: '#74AC91',
                type: 'dashed',
              },
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#167a50',
              },
            },
            axisLabel: {
              color: '#2afe97',
              formatter: '{value}',
            },
          },
        ],
        series: [
          {
            name: '竣工项目数量',
            type: 'bar',
            data: jgQty,
          },
          {
            name: '总项目数量',
            type: 'bar',
            data: totalQty,
          },
          {
            name: '新增完成项目数量',
            type: 'bar',
            data: newQty,
          },
          {
            name: '完成率',
            type: 'bar',
            yAxisIndex: 1,
            data: rateData,
          },
        ],
      }
    }
    return {}
  }, [JSON.stringify(chartTableData)])

  const reset = () => {
    setStartTime(null)
    setEndTime(null)
  }

  // useEffect(() => {
  //   run()
  // }, [JSON.stringify(startTime), JSON.stringify(endTime)])

  const changeToChart = (value: any) => {
    setShowType(value)
  }
  console.log(chartTableData, '123')
  return (
    <ChartBox title="竣工项目情况统计">
      <Spin delay={300} spinning={false}>
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
            <div className={styles.monitorTime}>
              <span className={styles.monitorChooseLabel}>选择日期</span>
              <div className={styles.monitorChooseTime}>
                <RangePicker
                  format="YYYY-MM-DD"
                  allowClear={false}
                  value={[startTime ? moment(startTime) : null, endTime ? moment(endTime) : null]}
                  onChange={(dates, dateStrings) => {
                    setStartTime(dateStrings[0])
                    setEndTime(dateStrings[1])
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
          </div>
          {showType === 'table' ? (
            <div className={styles.table}>
              <GeneralTable
                getTableRequestData={setChartTableData}
                noPaging
                rowKey="companyId"
                notShowSelect
                ref={tableRef}
                size="small"
                columns={columns}
                url="/Hotfix230908/GetCompletionRateByCreationIdentity"
                extractParams={{ startDate: startTime, endDate: endTime }}
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

export default ProjectSituation
