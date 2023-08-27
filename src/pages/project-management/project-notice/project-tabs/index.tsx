import GeneralTable from '@/components/general-table'
import { exportProjectCount } from '@/services/project-management/project-notice'
import { useUpdateEffect } from 'ahooks'
import { Button, message, Tabs } from 'antd'
import React, { useRef, useState } from 'react'
import styles from './index.less'
// import DesignTable from './components/design-table';

const { TabPane } = Tabs

const UserTabs: React.FC = () => {
  const csRef = useRef<HTMLDivElement>(null)
  const jgRef = useRef<HTMLDivElement>(null)
  const sgRef = useRef<HTMLDivElement>(null)
  const surveyRef = useRef<HTMLDivElement>(null)
  const designRef = useRef<HTMLDivElement>(null)

  const [spinning, setSpinning] = useState<boolean>(false)
  const [currentKey, setCurrentKey] = useState<string>('webCount')

  const csColumns = [
    {
      title: '排序',
      dataIndex: 'rank',
      index: 'rank',
    },
    {
      title: '单位',
      index: 'companyName',
      dataIndex: 'companyName',
    },
    {
      title: '初设完成比（完成项目数/总项目数）',
      index: 'rateExpress',
      dataIndex: 'rateExpress',
    },
    {
      title: '初设完成率(%)',
      index: 'rate',
      dataIndex: 'rate',
    },
  ]

  const sgColumns = [
    {
      title: '排序',
      dataIndex: 'rank',
      index: 'rank',
    },
    {
      title: '单位',
      index: 'companyName',
      dataIndex: 'companyName',
    },
    {
      title: '施工设计完成比（完成项目数/总项目数）',
      index: 'rateExpress',
      dataIndex: 'rateExpress',
    },
    {
      title: '施工设计完成率(%)',
      index: 'rate',
      dataIndex: 'rate',
    },
  ]
  const jgColumns = [
    {
      title: '排序',
      dataIndex: 'rank',
      index: 'rank',
    },
    {
      title: '单位',
      index: 'companyName',
      dataIndex: 'companyName',
    },
    {
      title: '竣工完成比（完成项目数/总项目数）',
      index: 'rateExpress',
      dataIndex: 'rateExpress',
    },
    {
      title: '竣工完成率(%)',
      index: 'rate',
      dataIndex: 'rate',
    },
  ]

  const surveyColumns = [
    {
      title: '排序',
      dataIndex: 'rank',
      index: 'rank',
    },
    {
      title: '区域',
      index: 'companyName',
      dataIndex: 'companyName',
    },
    {
      title: '勘察完成比（完成项目数/总项目数）',
      index: 'rateExpress',
      dataIndex: 'rateExpress',
    },
    {
      title: '勘察完成率(%)',
      index: 'rate',
      dataIndex: 'rate',
    },
  ]

  const designColumns = [
    {
      title: '排序',
      dataIndex: 'rank',
      index: 'rank',
    },
    {
      title: '单位',
      index: 'companyName',
      dataIndex: 'companyName',
    },
    {
      title: '设计完成比（完成项目数/总项目数）',
      index: 'rateExpress',
      dataIndex: 'rateExpress',
    },
    {
      title: '设计完成率(%)',
      index: 'rate',
      dataIndex: 'rate',
    },
  ]

  const refresh = () => {
    const ref =
      currentKey === 'cs'
        ? csRef
        : currentKey === 'sg'
        ? sgRef
        : currentKey === 'jg'
        ? jgRef
        : currentKey === 'survey'
        ? surveyRef
        : designRef

    if (ref && ref.current) {
      // @ts-ignore
      ref.current.refresh()
    }
  }

  const changeTabEvent = (key: string) => {
    setCurrentKey(key)
  }

  useUpdateEffect(() => {
    refresh()
  }, [currentKey])

  const exportEvent = async () => {
    try {
      setSpinning(true)

      const res = await exportProjectCount()
      let blob = new Blob([res], {
        type: 'application/vnd.ms-excel;charset=utf-8',
      })
      let finalyFileName = `项目统计表.xlsx`
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
      <div style={{ width: '100%', textAlign: 'right' }}>
        <Button type="primary" onClick={() => exportEvent()} loading={spinning} className="mr10">
          导出
        </Button>
      </div>

      <Tabs className="normalTabs noMargin" onChange={(key: string) => changeTabEvent(key)}>
        <TabPane tab="初设完成率统计" key="cs">
          <GeneralTable
            noPaging
            rowKey="rank"
            notShowSelect
            ref={csRef}
            columns={csColumns}
            requestType="get"
            url="/Hotfix230827/ProjectCompleteRateReportByCompany"
            extractParams={{ projectStage: 3 }}
          />
        </TabPane>
        <TabPane tab="施工设计完成率统计" key="sg">
          <GeneralTable
            noPaging
            rowKey="rank"
            notShowSelect
            ref={sgRef}
            columns={sgColumns}
            requestType="get"
            url="/Hotfix230827/ProjectCompleteRateReportByCompany"
            extractParams={{ projectStage: 4 }}
          />
        </TabPane>
        <TabPane tab="竣工完成率统计" key="jg">
          <GeneralTable
            noPaging
            rowKey="rank"
            notShowSelect
            ref={jgRef}
            columns={jgColumns}
            requestType="get"
            url="/Hotfix230827/ProjectCompleteRateReportByCompany"
            extractParams={{ projectStage: 5 }}
          />
        </TabPane>
        <TabPane tab="勘察完成统计" key="survey">
          <GeneralTable
            noPaging
            rowKey="rank"
            notShowSelect
            ref={surveyRef}
            columns={surveyColumns}
            url="/Hotfix230827/SurveyCompleteStatistics"
          />
        </TabPane>
        <TabPane tab="设计完成统计" key="design">
          <GeneralTable
            noPaging
            rowKey="rank"
            notShowSelect
            ref={designRef}
            columns={designColumns}
            url="/Hotfix230827/DesignCompleteStatistics"
          />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default UserTabs
