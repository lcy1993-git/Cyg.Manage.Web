import GeneralTable from '@/components/general-table'
import UrlSelect from '@/components/url-select'
import {
  exportBaseStatistic,
  exportShortStatistic,
} from '@/services/project-management/project-notice'
import { CaretDownOutlined } from '@ant-design/icons'
import { useUpdateEffect } from 'ahooks'
import { Button, message, Select, Tabs } from 'antd'
import uuid from 'node-uuid'
import React, { useRef, useState } from 'react'
import TempImport from '../components/temp-import'
import styles from './index.less'

const { TabPane } = Tabs

const { Option } = Select

export const categoryList = [
  {
    value: 1,
    text: '农网改造升级工程',
  },
  {
    value: 2,
    text: '城镇配网工程',
  },
  {
    value: 3,
    text: '无电地区电力建设',
  },
  {
    value: 4,
    text: '大修',
  },
  {
    value: 5,
    text: '技改',
  },
  {
    value: 6,
    text: '业扩配套',
  },
  {
    value: 7,
    text: '电网基建',
  },
]

const MaterialTabs: React.FC = () => {
  const baseRef = useRef<HTMLDivElement>(null)
  const shortRef = useRef<HTMLDivElement>(null)

  const [spinning, setSpinning] = useState<boolean>(false)
  const [currentKey, setCurrentKey] = useState<string>('base')

  const [importVisible, setImportVisible] = useState<boolean>(false)

  const [table, setTable] = useState<any>([])

  //阶段选择
  const [stage, setStage] = useState<number>(2)

  const [selectLabel, setSelectLable] = useState<string>('初设统计')

  const [pCategory, setPCategory] = useState<number>(1) //项目类别

  const bColumns: any[] = [
    {
      title: '序号',
      dataIndex: 'no',
      index: 'no',
      render: (text: any, record: any) => {
        return {
          children: text,
          props: { rowSpan: record.rowspan },
        }
      },
      width: 80,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '地市公司',
      index: 'companyName',
      dataIndex: 'companyName',
      render: (text: any, record: any) => {
        return {
          children: text,
          props: { rowSpan: record.companyRow },
        }
      },
      align: 'center',
      width: 250,
      fixed: 'left',
    },
    {
      title: '设计单位',
      index: 'designUnit',
      dataIndex: 'designUnit',
      align: 'center',
      render: (text: any, record: any) => {
        return {
          children: text,
          props: { rowSpan: record.designUnitRow },
        }
      },
      width: 300,
      fixed: 'left',
    },
    {
      title: '项目名称',
      index: 'projectName',
      dataIndex: 'projectName',
      align: 'center',
      width: 450,
    },

    {
      title: 'WBS编码',
      index: 'wbsCode',
      dataIndex: 'wbsCode',
      align: 'center',
      width: 450,
    },

    {
      title: '物资编号',
      index: 'goodsCode',
      dataIndex: 'goodsCode',
      width: 120,
      align: 'center',
    },
    {
      title: '物料名称',
      index: 'materialName',
      dataIndex: 'materialName',
      width: 120,
      align: 'center',
    },
    {
      title: '规格型号',
      index: 'spec',
      dataIndex: 'spec',
      width: 120,
      align: 'center',
    },
    {
      title: '物料数量',
      index: 'count',
      dataIndex: 'count',
      width: 120,
      align: 'center',
    },
  ]

  const sColumns: any[] = [
    {
      title: '序号',
      dataIndex: 'no',
      index: 'no',
      render: (text: any, record: any) => {
        return {
          children: text,
          props: { rowSpan: record.rowspan },
        }
      },
      width: 80,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '地市公司',
      index: 'companyName',
      dataIndex: 'companyName',
      render: (text: any, record: any) => {
        return {
          children: text,
          props: { rowSpan: record.companyRow },
        }
      },
      align: 'center',
      width: 250,
      fixed: 'left',
    },
    {
      title: '设计单位',
      index: 'designUnit',
      dataIndex: 'designUnit',
      align: 'center',
      width: 300,
      render: (text: any, record: any) => {
        return {
          children: text,
          props: { rowSpan: record.designUnitRow },
        }
      },
      fixed: 'left',
    },

    {
      title: '物资编号',
      index: 'goodsCode',
      dataIndex: 'goodsCode',
      width: 120,
      align: 'center',
    },
    {
      title: '物料名称',
      index: 'materialName',
      dataIndex: 'materialName',
      width: 120,
      align: 'center',
    },
    {
      title: '规格型号',
      index: 'spec',
      dataIndex: 'spec',
      width: 120,
      align: 'center',
    },
    {
      title: '物料数量',
      index: 'count',
      dataIndex: 'count',
      width: 120,
      align: 'center',
    },
  ]

  const refresh = () => {
    const ref = currentKey === 'base' ? baseRef : shortRef

    if (ref && ref.current) {
      // @ts-ignore
      ref.current.refresh()
    }
  }

  const changeTabEvent = (key: string) => {
    setCurrentKey(key)
    // setStage(2)
    setSelectLable('初设统计')
  }

  useUpdateEffect(() => {
    refresh()
  }, [currentKey])

  const exportEvent = async () => {
    if (currentKey === 'base') {
      try {
        setSpinning(true)
        const res = await exportBaseStatistic(stage, pCategory)
        let blob = new Blob([res], {
          type: 'application/vnd.ms-excel;charset=utf-8',
        })
        let finalyFileName = `基础统计表[${selectLabel}].xlsx`
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
    } else {
      try {
        setSpinning(true)
        const res = await exportShortStatistic(stage, pCategory)
        let blob = new Blob([res], {
          type: 'application/vnd.ms-excel;charset=utf-8',
        })
        let finalyFileName = `简略统计表[${selectLabel}].xlsx`
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
  }

  //切换阶段
  const changeStage = (value: any) => {
    setStage(value)
    const ref = currentKey === 'base' ? baseRef : shortRef
    if (ref && ref.current) {
      // @ts-ignore
      ref.current.searchByParams({
        projectStage: value,
        PCategory: pCategory,
        statisticsOperationCategory: 1,
      })
    }
  }
  //切换项目类别
  const changeCategory = (value: any) => {
    setPCategory(value)
    const ref = currentKey === 'base' ? baseRef : shortRef
    if (ref && ref.current) {
      // @ts-ignore
      ref.current.searchByParams({
        projectStage: stage,
        PCategory: value,
        statisticsOperationCategory: 1,
      })
    }
  }

  //打开导入模态框
  const importEvent = () => {
    setImportVisible(true)
  }

  return (
    <div className={styles.missionTabs}>
      <div className={styles.filterArea}>
        <div className="mr22">
          <span className="mr7">项目类别：</span>

          <UrlSelect
            valuekey="value"
            titlekey="text"
            defaultData={categoryList}
            value={pCategory}
            style={{ width: '178px' }}
            onChange={(value) => {
              changeCategory(value)
            }}
            placeholder="项目类别"
          />
        </div>
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
            <Option value={2}>可研统计</Option>
            <Option value={3}>初设统计</Option>
            <Option value={4}>施工统计</Option>
            <Option value={5}>竣工统计</Option>
          </Select>
        </div>
        <Button
          type="primary"
          style={{ width: '90px' }}
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
        <TabPane tab="基础统计" key="base">
          <GeneralTable
            noPaging
            rowKey={uuid.v1()}
            notShowSelect
            ref={baseRef}
            columns={bColumns}
            requestType="get"
            url="/Hotfix240506/CloudPlatMaterialInfoStatics"
            extractParams={{
              projectStage: stage,
              PCategory: pCategory,
              statisticsOperationCategory: 1,
            }}
            dataSource={table?.items}
            getTableRequestData={setTable}
            tableHeight="calc(100% - 30px)"
            scroll={{ y: 'calc(98vh - 429px)' }}
          />
        </TabPane>
        <TabPane tab="简略统计" key="short">
          <GeneralTable
            noPaging
            rowKey={uuid.v1()}
            notShowSelect
            ref={shortRef}
            columns={sColumns}
            requestType="get"
            dataSource={table?.items}
            getTableRequestData={setTable}
            url="/Hotfix240506/CloudPlatMateriaBrieflInfoStatics"
            extractParams={{
              projectStage: stage,
              PCategory: pCategory,
              statisticsOperationCategory: 1,
            }}
            tableHeight="calc(100% - 30px)"
            scroll={{ y: 'calc(98vh - 429px)' }}
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

      <TempImport
        visible={importVisible}
        onChange={setImportVisible}
        currentKey={currentKey}
        category={pCategory}
        refreshEvent={changeStage}
      />
    </div>
  )
}

export default MaterialTabs
