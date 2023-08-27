import GeneralTable from '@/components/general-table'
import { exportUserCount } from '@/services/project-management/project-notice'
import { useUpdateEffect } from 'ahooks'
import { Button, DatePicker, message, Tabs } from 'antd'
import moment, { Moment } from 'moment'
import React, { useRef, useState } from 'react'
import styles from './index.less'
// import DesignTable from './components/design-table';

const { TabPane } = Tabs
const { RangePicker } = DatePicker

const UserTabs: React.FC = () => {
  const webCountRef = useRef<HTMLDivElement>(null)
  const webTimeRef = useRef<HTMLDivElement>(null)
  const surveyCountRef = useRef<HTMLDivElement>(null)
  const surveyTimeRef = useRef<HTMLDivElement>(null)
  const surveyUploadRef = useRef<HTMLDivElement>(null)
  const designCountRef = useRef<HTMLDivElement>(null)
  const designTimeRef = useRef<HTMLDivElement>(null)
  const [startTime, setStartTime] = useState<Moment | String>(moment(new Date()))
  const [endTime, setEndTime] = useState<Moment | String>(moment(new Date()))

  const [currentClient, setCurrentClient] = useState<number>(2)
  const [currentKey, setCurrentKey] = useState<string>('webCount')

  const [spinning, setSpinning] = useState<boolean>(false)

  const countColumns = [
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
      index: 'name',
      dataIndex: 'name',
    },
    {
      title: '人均登录次数',
      index: 'averageValue',
      dataIndex: 'averageValue',
    },
    {
      title: '总登录次数',
      index: 'totalValue',
      dataIndex: 'totalValue',
    },
  ]

  const timeColumns = [
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
      index: 'name',
      dataIndex: 'name',
    },
    {
      title: '人均登录时长',
      index: 'averageValue',
      dataIndex: 'averageValue',
    },
    {
      title: '总登录时长',
      index: 'totalValue',
      dataIndex: 'totalValue',
    },
  ]
  const surveyUploadColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      index: 'rank',
    },
    {
      title: '单位',
      index: 'companyName',
      dataIndex: 'companyName',
    },
    {
      title: '人均勘察次数',
      index: 'perCapita',
      dataIndex: 'perCapita',
    },
    {
      title: '总勘察次数',
      index: 'sum',
      dataIndex: 'sum',
    },
  ]

  const reset = () => {
    setStartTime(moment(new Date()))
    setEndTime(moment(new Date()))
  }

  const searchByParams = () => {
    const ref =
      currentKey === 'webCount'
        ? webCountRef
        : currentKey === 'webTime'
        ? webTimeRef
        : currentKey === 'surveyCount'
        ? surveyCountRef
        : currentKey === 'surveyTime'
        ? surveyTimeRef
        : currentKey === 'surveyUpload'
        ? surveyUploadRef
        : currentKey === 'designCount'
        ? designCountRef
        : designTimeRef
    if (ref && ref.current) {
      // @ts-ignore
      ref.current.searchByParams({
        clientCategory: currentClient,
        startDate: startTime,
        endDate: endTime,
      })
    }
  }

  const changeTabEvent = (key: string) => {
    setCurrentKey(key)
    if (key === 'webTime' || key === 'webCount') {
      setCurrentClient(2)
    }
    if (key === 'designTime' || key === 'designCount') {
      setCurrentClient(8)
    }
    if (key === 'surveyTime' || key === 'surveyCount' || key === 'surveyUpload') {
      setCurrentClient(4)
    }
  }

  useUpdateEffect(() => {
    searchByParams()
  }, [currentKey])

  const exportEvent = async () => {
    try {
      setSpinning(true)

      const res = await exportUserCount({
        startDate: startTime,
        endDate: endTime,
      })
      let blob = new Blob([res], {
        type: 'application/vnd.ms-excel;charset=utf-8',
      })
      let finalyFileName = `用户统计表.xlsx`
      // for IE
      //@ts-ignore
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //@ts-ignore
        window.navigator.msSaveOrOpenBlob(blob, finalyFileName)
      } else {
        // for Non-IE
        let objectUrl = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.href = objectUrl
        link.setAttribute('download', finalyFileName)
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(link.href)
      }
      setSpinning(false)
      message.success('导出成功')
    } catch (err) {
      console.log(err)
    } finally {
      setSpinning(false)
    }
  }
  return (
    <div className={styles.missionTabs}>
      <div className={styles.search}>
        <div>
          <RangePicker
            format="YYYY-MM-DD"
            allowClear={false}
            //@ts-ignore
            value={[startTime ? moment(startTime) : null, endTime ? moment(endTime) : null]}
            onChange={(dates, dateStrings) => {
              setStartTime(dateStrings[0])
              setEndTime(dateStrings[1])
            }}
            // bordered={false}
            renderExtraFooter={() => [
              <Button key="clearDate" onClick={() => reset()}>
                今日
              </Button>,
            ]}
          />
          <Button className="ml7" type="primary" onClick={() => searchByParams()}>
            查询
          </Button>
        </div>

        <Button type="primary" onClick={() => exportEvent()} loading={spinning}>
          导出
        </Button>
      </div>
      {/* <Spin spinning={spinning} tip="导出中..." style={{ width: '100%', height: '100%' }}> */}
      <Tabs className="normalTabs noMargin" onChange={(key: string) => changeTabEvent(key)}>
        <TabPane tab="管理端登录次数统计" key="webCount">
          <GeneralTable
            noPaging
            rowKey="id"
            notShowSelect
            ref={webCountRef}
            columns={countColumns}
            url="/Hotfix230827/GetUserStatisticsOfSignInCount"
            extractParams={{ clientCategory: 2, startDate: startTime, endDate: endTime }}
          />
        </TabPane>
        <TabPane tab="管理端登录时长统计" key="webTime">
          <GeneralTable
            noPaging
            rowKey="id"
            notShowSelect
            ref={webTimeRef}
            columns={timeColumns}
            url="/Hotfix230827/GetUserStatisticsOfSignInDuration"
            extractParams={{ clientCategory: 2, startDate: startTime, endDate: endTime }}
          />
        </TabPane>
        <TabPane tab="勘察端登录次数统计" key="surveyCount">
          <GeneralTable
            noPaging
            rowKey="id"
            notShowSelect
            ref={surveyCountRef}
            columns={countColumns}
            url="/Hotfix230827/GetUserStatisticsOfSignInCount"
            extractParams={{ clientCategory: 4, startDate: startTime, endDate: endTime }}
          />
        </TabPane>
        <TabPane tab="勘察端登录时长统计" key="surveyTime">
          <GeneralTable
            noPaging
            rowKey="id"
            notShowSelect
            ref={surveyTimeRef}
            columns={timeColumns}
            url="/Hotfix230827/GetUserStatisticsOfSignInDuration"
            extractParams={{ clientCategory: 4, startDate: startTime, endDate: endTime }}
          />
        </TabPane>
        <TabPane tab="勘察端数据上传统计" key="surveyUpload">
          <GeneralTable
            noPaging
            rowKey="rank"
            notShowSelect
            ref={surveyUploadRef}
            columns={surveyUploadColumns}
            url="/Hotfix230827/SurveyUploadStatistics"
          />
        </TabPane>
        <TabPane tab="设计端登录次数统计" key="designCount">
          <GeneralTable
            noPaging
            rowKey="id"
            notShowSelect
            ref={designCountRef}
            columns={countColumns}
            url="/Hotfix230827/GetUserStatisticsOfSignInCount"
            extractParams={{ clientCategory: 8, startDate: startTime, endDate: endTime }}
          />
        </TabPane>
        <TabPane tab="设计端登录时长统计" key="designTime">
          <GeneralTable
            noPaging
            rowKey="id"
            notShowSelect
            ref={designTimeRef}
            columns={timeColumns}
            url="/Hotfix230827/GetUserStatisticsOfSignInDuration"
            extractParams={{ clientCategory: 8, startDate: startTime, endDate: endTime }}
          />
        </TabPane>
      </Tabs>
      {/* </Spin> */}
    </div>
  )
}

export default UserTabs
