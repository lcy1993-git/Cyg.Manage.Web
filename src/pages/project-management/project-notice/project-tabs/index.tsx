import GeneralTable from '@/components/general-table'
import { exportCloudPlat } from '@/services/project-management/project-notice'
import { CaretDownOutlined } from '@ant-design/icons'
import { useUpdateEffect } from 'ahooks'
import { Button, message, Select, Tabs } from 'antd'
import moment from 'moment'
import uuid from 'node-uuid'
import React, { useRef, useState } from 'react'
import TempImport from '../components/temp-import'
import styles from './index.less'

const { TabPane } = Tabs

const { Option } = Select

const UserTabs: React.FC = () => {
  const yunRef = useRef<HTMLDivElement>(null)
  const pfRef = useRef<HTMLDivElement>(null)

  const [spinning, setSpinning] = useState<boolean>(false)
  const [currentKey, setCurrentKey] = useState<string>('yun')

  const [importVisible, setImportVisible] = useState<boolean>(false)

  const [table, setTable] = useState<any>([])

  //阶段选择
  const [stage, setStage] = useState<number>(currentKey === 'yun' ? 2 : 3)

  const [selectLabel, setSelectLable] = useState<string>('可研统计')

  const yColumns: any[] = [
    {
      title: '序号',
      dataIndex: 'index',
      index: 'index',
      render: (text: any, record: any, index: number) => {
        return {
          children: record.rowspan !== 0 ? (index === 0 ? index + 1 : index) : null,
          props: { rowSpan: record.rowspan },
        }
      },
      width: 80,
      align: 'center',
    },
    {
      title: '业主单位',
      index: 'creationCompanyName',
      dataIndex: 'creationCompanyName',
      render: (text: any, record: any) => {
        return {
          children: text,
          props: { rowSpan: record.rowspan },
        }
      },
      align: 'center',
      width: 300,
    },
    {
      title: '设计院',
      index: 'executionCompanyName',
      dataIndex: 'executionCompanyName',
      align: 'center',
    },

    {
      title: '未勘察',
      index: 'unSurvey',
      dataIndex: 'unSurvey',
      width: 120,
      align: 'center',
    },
    {
      title: '勘察中',
      index: 'surveying',
      dataIndex: 'surveying',
      width: 120,
      align: 'center',
    },
    {
      title: '已勘察',
      index: 'surveyed',
      dataIndex: 'surveyed',
      width: 120,
      align: 'center',
    },
    {
      title: '设计中',
      index: 'designing',
      dataIndex: 'designing',
      width: 120,
      align: 'center',
    },
    {
      title: '设计完成',
      index: 'designed',
      dataIndex: 'designed',
      width: 120,
      align: 'center',
    },
    {
      title: '总项目数',
      index: 'totalProjectCount',
      dataIndex: 'totalProjectCount',
      render: (text: any, record: any) => {
        return {
          children: text,
          props: { rowSpan: record.rowspan },
        }
      },
      width: 120,
      align: 'center',
    },
    {
      title: '初设完成率',
      index: 'completedRate',
      dataIndex: 'completedRate',
      render: (text: any, record: any) => {
        return (
          <span>{`${record.completedRate ? (record.completedRate * 100)?.toFixed(2) : 0}%`}</span>
        )
      },
      width: 120,
      align: 'center',
    },
    {
      title: '地州项目完成率',
      index: 'totalCompletedRate',
      dataIndex: 'totalCompletedRate',
      render: (text: any, record: any) => {
        return {
          children: `${text ? (text * 100)?.toFixed(2) : 0}%`,
          props: { rowSpan: record.rowspan },
        }
      },
      width: 150,
      align: 'center',
    },
  ]

  const pColumns: any[] = [
    {
      title: '地州',
      dataIndex: 'rank',
      index: 'rank',
      width: 180,
      align: 'center',
    },
    {
      title: '项目名称',
      index: 'companyName',
      dataIndex: 'companyName',
      align: 'center',
    },
    {
      title: '设计院',
      index: 'rateExpress',
      dataIndex: 'rateExpress',
      width: 300,
      align: 'center',
    },
    {
      title: '新增批复工程量',
      children: [
        {
          title: '10kV线路',
          dataIndex: 'col6',
          key: 'col6',
          width: 100,
          align: 'center',
        },
        {
          title: '0.4kV线路',
          dataIndex: 'col6',
          key: 'col6',
          width: 100,
          align: 'center',
        },
        {
          title: '变电容量',
          dataIndex: 'col6',
          key: 'col6',
          width: 100,
          align: 'center',
        },
      ],
    },
    {
      title: '新增竣工图工程量',
      children: [
        {
          title: '10kV线路',
          dataIndex: 'col6',
          key: 'col6',
          width: 100,
          align: 'center',
        },
        {
          title: '0.4kV线路',
          dataIndex: 'col6',
          key: 'col6',
          width: 100,
          align: 'center',
        },
        {
          title: '变电容量',
          dataIndex: 'col6',
          key: 'col6',
          width: 100,
          align: 'center',
        },
      ],
    },
    {
      title: '10kV线路差值',
      index: 'rateExpress',
      dataIndex: 'rateExpress',
      width: 120,
      align: 'center',
    },
    {
      title: '10kV差值百分比',
      index: 'rateExpress',
      dataIndex: 'rateExpress',
      width: 120,
      align: 'center',
    },
    {
      title: '变台存在差异',
      index: 'rateExpress',
      dataIndex: 'rateExpress',
      width: 100,
      align: 'center',
    },
  ]

  const refresh = () => {
    const ref = currentKey === 'yun' ? yunRef : pfRef

    if (ref && ref.current) {
      // @ts-ignore
      ref.current.refresh()
    }
  }

  const changeTabEvent = (key: string) => {
    setCurrentKey(key)
    if (key === 'pf') {
      setStage(3)
    } else {
      setStage(2)
    }
  }

  useUpdateEffect(() => {
    refresh()
  }, [currentKey])

  const exportEvent = async () => {
    try {
      setSpinning(true)

      const res = await exportCloudPlat(stage)
      let blob = new Blob([res], {
        type: 'application/vnd.ms-excel;charset=utf-8',
      })
      let finalyFileName = `云平台应用统计表[${selectLabel}].xlsx`
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

  //切换状态
  const changeStage = (value: any) => {
    setStage(value)
    if (yunRef && yunRef.current) {
      // @ts-ignore
      yunRef.current.searchByParams({
        stage: value,
      })
    }
  }

  //打开导入模态框
  const importEvent = () => {
    setImportVisible(true)
  }

  // const testData = [
  //   { rowspan: 3 },
  //   { rowspan: 0 },
  //   { rowspan: 0 },
  //   { rowspan: 2 },
  //   { rowspan: 0 },
  //   { rowspan: 1 },
  //   { rowspan: 2 },
  //   { rowspan: 0 },
  //   { rowspan: 1 },
  //   { rowspan: 1 },
  // ]
  return (
    <div className={styles.missionTabs}>
      <div className={styles.filterArea}>
        <div className="mr22">
          <span className="mr7">阶段选择：</span>
          <Select
            value={stage}
            suffixIcon={<CaretDownOutlined />}
            onChange={(value: any, option: any) => {
              setSelectLable(option.children)
              changeStage(value)
            }}
          >
            {currentKey === 'yun' && <Option value={2}>可研统计</Option>}
            <Option value={3}>初设统计</Option>
            <Option value={4}>施工统计</Option>
            <Option value={5}>竣工统计</Option>
          </Select>
        </div>
        <Button
          type="primary"
          style={{ width: '80px' }}
          onClick={() => importEvent()}
          className="mr10"
        >
          导入
        </Button>
        <Button
          type="primary"
          style={{ width: '80px' }}
          onClick={() => exportEvent()}
          loading={spinning}
          className="mr10"
        >
          导出
        </Button>
      </div>
      <Tabs
        className="normalTabs noMargin"
        onChange={(key: string) => changeTabEvent(key)}
        activeKey={currentKey}
      >
        <TabPane tab="云平台应用统计" key="yun">
          <GeneralTable
            noPaging
            rowKey={uuid.v1()}
            notShowSelect
            ref={yunRef}
            columns={yColumns}
            requestType="get"
            url="/Hotfix231202/CloudPlatCompletedRateStatics"
            extractParams={{ stage: stage }}
            dataSource={table?.items}
            getTableRequestData={setTable}
            tableHeight="calc(100% - 30px)"
          />
        </TabPane>
        <TabPane tab="批复工程量统计" key="pf">
          <GeneralTable
            noPaging
            rowKey="rank"
            notShowSelect
            ref={pfRef}
            columns={pColumns}
            requestType="get"
            url="/Hotfix230827/ProjectCompleteRateReportByCompany"
            extractParams={{ projectStage: 4 }}
          />
        </TabPane>
        {/* <TabPane tab="竣工完成率统计" key="jg">
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
        </TabPane> */}
      </Tabs>
      <div style={{ marginLeft: '20px' }}>
        截止日期：
        {table?.updateTime < 0 ? '-' : moment(table?.updateTime).format('YYYY-MM-DD HH:mm')}
      </div>
      <TempImport
        visible={importVisible}
        onChange={setImportVisible}
        currentKey={currentKey}
        refreshEvent={refresh}
      />
    </div>
  )
}

export default UserTabs
