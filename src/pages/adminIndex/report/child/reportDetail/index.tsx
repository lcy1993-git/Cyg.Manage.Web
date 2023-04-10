import React, { Key, useCallback, useEffect, useRef, useState } from 'react'
import styles from './index.less'
import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import { useMount, useSize, useUnmount } from 'ahooks'
import { Table, Input, DatePicker, Space, Button, Spin } from 'antd'
import { DownloadOutlined, SortAscendingOutlined } from '@ant-design/icons/lib/icons'
import { optionConfig } from '@/pages/adminIndex/report/child/reportDetail/optionCofig'
import moment, { Moment } from 'moment'
import noData from '@/assets/index/noData.png'
import {
  getAuditPageList,
  GetLoginOutEvents,
  PassWordRestPageList,
  PassWordRestRank,
  SecurityAuditPageItem,
} from '@/services/security-audit'
import savePdf from '@/utils/create-pdf'
import createCanvas from '@/utils/create-pdf/create-canvas'
import _ from 'lodash'

const { Search } = Input

interface Props {
  options: string | Key
  title: string
  id: string
}

const ReportDetail: React.FC<Props> = (props) => {
  const { options, title, id } = props
  const chartRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const pwdRef = useRef<HTMLDivElement>(null)
  const [tabs, setTabs] = useState<{ tab: string; key: string }[]>([]) // 表格面板
  const [active, setActive] = useState<string>('1') // 激活的表格面板
  const [keyWord, setKeyWord] = useState('') //搜索关键词
  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  })
  const [noChartData, setNoChartData] = useState(false)
  const [date, setDate] = useState<string>('')
  const [tableData, setTableData] = useState<SecurityAuditPageItem[]>([])
  const [sort, setSort] = useState<boolean>(false) // 是否排序
  const [pwdRank, setPwdRank] = useState<
    {
      // 密码修改排序
      key: string
      value: number
    }[]
  >([])
  const [columns, setColumns] = useState([])
  const [spinning, setSpinning] = useState(false)
  const [optionsWithData, setOptionsWithData] = useState<object>({})
  const chartSize = useSize(chartRef)
  const myChart = useRef(null)
  const defaultColumns = [
    {
      title: '时间',
      dataIndex: 'executionTime',
      render: (text: Moment) => {
        return moment(text).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      title: '端口',
      dataIndex: 'clientTypeText',
    },
    {
      title: '设备IP',
      dataIndex: 'clientIp',
    },
    {
      title: '事件类型',
      dataIndex: 'eventDetailType',
    },
    {
      title: '事件结果',
      dataIndex: 'executionResult',
    },
    {
      title: '用户名',
      dataIndex: 'executionUserName',
    },
    {
      title: '事件ID ',
      dataIndex: 'eventId',
    },
  ]
  const trendColumns = [
    {
      title: '时间',
      dataIndex: 'dateTime',
      key: 'dateTime',
      render: (text: Moment) => {
        return moment(text).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      title: '管理端',
      dataIndex: 'manageCount',
      align: 'center',
      key: 'manageCount',
    },
    {
      title: '勘察端',
      dataIndex: 'surveyCount',
      align: 'center',
      key: 'surveyCount',
    },
    {
      title: '设计端',
      dataIndex: 'designCount',
      align: 'center',
      key: 'designCount',
    },
    {
      title: '评审端',
      dataIndex: 'reviewCount',
      align: 'center',
      key: 'reviewCount',
    },
    {
      title: '总计',
      dataIndex: 'total',
      align: 'center',
      key: 'total',
    },
    {
      title: '百分比',
      dataIndex: 'rate',
      align: 'center',
      key: 'rate',
      render(v: any) {
        return (
          <span>{isNaN(v) ? '' : Number(v) % 1 === 0 ? Number(v) : Number(v).toFixed(2)}% </span>
        )
      },
    },
  ]
  const rangeColors = ['#FB2E3C', '#C68271', '#F87F37', '#505050', '#505050']
  const rangeBorderColors = ['#EEC9CC', '#EECFC9', '#F6D7C1', '#D8D8D8', '#D8D8D8']
  const pwdColumns = [
    {
      title: '排名',
      width: 50,
      align: 'center',
      render(v: any, record: any, index: number) {
        return (
          <span
            style={{
              border: `1px solid ${rangeBorderColors[index]}`,
              display: 'inline-block',
              width: 24,
              lineHeight: '22px',
              height: 24,
              color: rangeColors[index],
              borderRadius: '50%',
            }}
          >
            {index + 1}
          </span>
        )
      },
    },
    {
      title: '账号',
      dataIndex: 'key',
      align: 'center',
      key: 'key',
    },
    {
      title: '重置次数',
      align: 'center',
      dataIndex: 'value',
      key: 'value',
    },
  ]
  const sortTable = () => {
    // 排序
    if (['loginTrend', 'exitLoginTrend'].includes(active)) {
      // 登录趋势排序
      const value = [...tableData]
      const res = value.sort((a, b) => {
        if (sort) {
          return a.rate - b.rate
        } else {
          return b.rate - a.rate
        }
      })
      setTableData(res)
      setSort(!sort)
    } else {
      setSort(!sort)
    }
  }
  const initChart = useCallback(
    (data: any) => {
      if (chartRef && chartRef.current) {
        myChart.current = echarts.init(chartRef.current as unknown as HTMLDivElement)
        myChart.current.clear()
        myChart.current.setOption(data, true)
      }
      if (chartRef && chartRef?.current) {
        myChart.current = echarts.init(chartRef.current as unknown as HTMLDivElement)
        myChart.current.clear()
        myChart.current.setOption(data, true)
      }
    },
    [id, active]
  )
  const resize = () => {
    myChart.current.resize()
  }
  const getPwdChangeRanking = async () => {
    // 获取密码修改排序结果
    const result = await PassWordRestRank()
    if (result) {
      if (result?.length === 0) {
        setNoChartData(true)
        return
      } else {
        setNoChartData(false)
      }
      setPwdRank(result)
    }
  }
  const onChange = (val: Moment) => {
    const d = moment(val).format('YYYY-MM-DD')
    setPagination({
      total: 0,
      pageIndex: 1,
      pageSize: pagination.pageSize,
    })
    if (d !== 'null' && d !== 'Invalid date') {
      setDate(d)
    } else {
      setDate('')
    }
  }
  const getTableData = async (
    page?: { total?: number; pageIndex: number; pageSize: number },
    nullKey?: boolean
  ) => {
    const data = {
      pageIndex: page?.pageIndex || pagination.pageIndex,
      pageSize: page?.pageSize || pagination.pageSize,
      keyWord: nullKey ? '' : keyWord.trim(),
      sort: {
        propertyName: 'eventId',
        isAsc: sort,
      },
    }
    if (date !== '') {
      // 携带日期搜索
      data['dateTime'] = date
    }
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(id)) {
      // 正常通过事件类型查询列表
      data['eventType'] = Number(id)
    } else if (id === '12') {
      // 所有系统事件
      data['auditType'] = 1
    } else if (id === '13') {
      // 所有业务事件
      data['auditType'] = 2
    }
    let res: { items: any; pageSize: any; total: any; pageIndex: any }
    if (id === '4') {
      // 密码重置事件单独接口
      res = await PassWordRestPageList(data)
    } else {
      res = await getAuditPageList(data)
    }
    if (res?.items) {
      setTableData(res.items)
      setPagination({
        pageSize: res.pageSize,
        total: res.total,
        pageIndex: res.pageIndex,
      })
      return new Promise((resolve) => {
        resolve(res.items)
      })
    }
  }
  const disabledDate = useCallback(
    (current: Moment) => {
      return current <= moment().subtract(90, 'days') || current > moment().endOf('day')
    },
    [date]
  )
  const onSearch = async (value: string) => {
    const page = {
      ...pagination,
      pageIndex: 1,
    }
    if (value === '') {
      setKeyWord('')
      await getTableData(page, true)
    } else {
      await getTableData(page)
    }
  }
  const pageOnChange = async (val: number, pageSize: number) => {
    setPagination({ ...pagination, pageIndex: val, pageSize: pageSize })
    await getTableData({
      total: pagination.total,
      pageIndex: val,
      pageSize: pageSize,
    })
  }
  const getChartData = () => {
    const chartConfig = optionConfig[options].find((i: { key: string }) => i.key === active)
    if (chartConfig !== undefined) {
      chartConfig.getData(date).then((res: any) => {
        if (res?.length === 0) {
          setNoChartData(true)
        } else {
          setNoChartData(false)
        }
        // 获取图表数据
        const data = chartConfig.dealChartData(res, chartConfig.options) // 初始化图表配置文件
        initChart(data)
        setOptionsWithData(data)
      })
    }
  }
  const getLoginTableData = async () => {
    const result = await GetLoginOutEvents({
      isLogout: active !== 'loginTrend',
      queryDate: date,
    })
    result && setTableData(result)
  }
  const updateTableColumns = () => {
    // 不同的事件有不同的列
    if (['11', '12', '13', '1', '2', '3', '5', '7', '8', '9', '10'].includes(id)) {
      // @ts-ignore
      setColumns(defaultColumns)
    } else if (id === '4') {
      const res = defaultColumns.map((item) => {
        if (item.title === '事件结果') {
          item = {
            title: '重置次数',
            dataIndex: 'frequency',
          }
        }
        if (item.title === '用户名') {
          item = {
            title: '用户名',
            dataIndex: 'operationDataId',
          }
        }
        return item
      })
      // @ts-ignore
      setColumns(res)
    } else if (id === '6') {
      const res = defaultColumns.filter((item) => {
        return item.title !== '事件结果'
      })
      // @ts-ignore
      setColumns(res)
    }
  }
  const exportChartToPdf = () => {
    setSpinning(true)
    const ChartTitle = document.createElement('h3')
    ChartTitle.className = styles.chartTitle
    ChartTitle.innerText = title
    const cloneData = _.cloneDeep(optionsWithData)
    if (Array.isArray(cloneData.series) && cloneData.series[0].type === 'pie') {
      cloneData.legend.right = '20%'
    }
    const cv = createCanvas(cloneData, {
      width: '780px',
      height: '300px',
    })
    if (!['loginTrend', 'exitLoginTrend'].includes(active)) {
      // 更新table数据
      setTimeout(() => {
        if (id === '4') {
          // @ts-ignore
          savePdf([ChartTitle, pwdRef?.current, tableRef?.current], title)
        } else {
          // @ts-ignore
          savePdf([ChartTitle, cv, tableRef?.current!], title)
        }
      }, 1000)
      setSpinning(false)
    } else {
      getLoginTableData().then(() => {
        setTimeout(() => {
          if (id === '4') {
            // @ts-ignore
            savePdf([ChartTitle, pwdRef?.current, tableRef?.current], title)
          } else {
            // @ts-ignore
            savePdf([ChartTitle, cv, tableRef?.current!], title)
          }
          setSpinning(false)
          getLoginTableData()
        }, 1000)
      })
    }
  }
  useMount(() => {
    window.addEventListener('resize', () => {
      if (!chartRef.current) {
        // 如果切换到其他页面，这里获取不到对象，删除监听。否则会报错
        window.removeEventListener('resize', resize)
        return
      } else {
        resize()
      }
    })
  })
  useUnmount(() => {
    window.removeEventListener('resize', resize)
  })
  useEffect(() => {
    !['loginTrend', 'exitLoginTrend'].includes(active) && getTableData().then()
  }, [sort])
  useEffect(() => {
    if (!!options) {
      setTabs(optionConfig[options])
      setActive(optionConfig[options][0].key)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(chartSize), options])
  useEffect(() => {
    if (options === undefined) return
    if (id !== '4') {
      getChartData()
    } else {
      getPwdChangeRanking().then()
    }
    if (['loginTrend', 'exitLoginTrend'].includes(active)) {
      getLoginTableData().then()
    }
    updateTableColumns()
  }, [active, options, id, date])
  useEffect(() => {
    if (!['loginTrend', 'exitLoginTrend'].includes(active)) {
      // 更新table数据
      getTableData().then()
    } else {
      getLoginTableData().then()
    }
  }, [id, date, active])
  useEffect(() => {
    setDate('')
  }, [id])
  const NoData = () => {
    return (
      <div className={styles.noData}>
        <img src={noData} alt="暂无数据" draggable={false} />
        <p>暂无数据</p>
      </div>
    )
  }
  return (
    <div className={styles.reportDetailBox}>
      <Spin spinning={spinning} tip={'导出中...'}>
        <div className={styles.reportDetailTitle}>
          <div className={styles.leftSideTitleBorder}>{title}</div>
        </div>
        <div className={styles.reportDetailBg}>
          <div className={styles.reportTabs}>
            {tabs.map((item) => {
              return (
                <div
                  className={styles.reportTabsItemTitle}
                  style={{ background: active === item.key ? '#fff' : '' }}
                  onClick={() => setActive(item.key)}
                >
                  <p style={{ color: active === item.key ? '#1F1F1F' : '#696969' }}>{item.tab}</p>
                </div>
              )
            })}
          </div>
          <div className={styles.exportButton}>
            <Button icon={<DownloadOutlined />} type={'primary'} onClick={exportChartToPdf}>
              导出
            </Button>
          </div>
          <div className={styles.chartBox}>
            {id !== '4' && (
              <div
                ref={chartRef}
                style={{
                  width: '100%',
                  height: '100%',
                  display: noChartData ? 'none' : 'block',
                }}
              />
            )}
            {noChartData && (
              <div className={styles.noDataBox}>
                <NoData />
              </div>
            )}
            {id === '4' && (
              <div className={styles.pwdTable} ref={pwdRef}>
                <Table
                  // @ts-ignore
                  columns={pwdColumns}
                  pagination={false}
                  size={'small'}
                  style={{
                    margin: '20px',
                  }}
                  locale={{ emptyText: <NoData /> }}
                  dataSource={pwdRank}
                />
              </div>
            )}
          </div>
          <div className={styles.tableBox}>
            <div className={styles.tableBoxTool}>
              {['loginTrend', 'exitLoginTrend'].includes(active) ? (
                <div />
              ) : (
                <Search
                  placeholder="请输入用户名或事件ID进行查询"
                  style={{
                    width: '300px',
                  }} // 这两个表格没有搜索
                  allowClear={true}
                  onChange={(e) => setKeyWord(e.target.value)}
                  onSearch={onSearch}
                  enterButton
                />
              )}
              <div>
                <Space>
                  {/*// @ts-ignore*/}
                  <DatePicker
                    onChange={onChange}
                    disabledDate={disabledDate}
                    value={date !== '' ? moment(date) : null}
                  />
                  <Button icon={<SortAscendingOutlined />} onClick={sortTable}>
                    排序
                  </Button>
                </Space>
              </div>
            </div>
            <Table
              // @ts-ignore*
              columns={['loginTrend', 'exitLoginTrend'].includes(active) ? trendColumns : columns}
              bordered
              locale={{ emptyText: <NoData /> }}
              pagination={
                ['loginTrend', 'exitLoginTrend'].includes(active)
                  ? false
                  : {
                      showSizeChanger: true,
                      pageSize: pagination.pageSize,
                      onChange: pageOnChange,
                      current: pagination.pageIndex,
                      total: pagination.total,
                    }
              }
              scroll={{
                y: ['loginTrend', 'exitLoginTrend'].includes(active) ? '26vh' : '23vh',
              }}
              size={'small'}
              dataSource={tableData}
            />
          </div>
        </div>
        {/*{spinning && (*/}
        <div className={styles.uploadPdfTable} ref={tableRef}>
          <Table
            // @ts-ignore*
            columns={['loginTrend', 'exitLoginTrend'].includes(active) ? trendColumns : columns}
            bordered
            locale={{ emptyText: <NoData /> }}
            ref={tableRef}
            pagination={false}
            size={'small'}
            dataSource={tableData}
            style={{
              margin: '20px',
            }}
          />
        </div>
        {/*)}*/}
      </Spin>
    </div>
  )
}

export default ReportDetail
