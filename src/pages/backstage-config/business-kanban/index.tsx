import React, {useEffect, useState } from 'react'
import PageCommonWrap from '@/components/page-common-wrap'
import styles from './index.less'
import { Progress, Select, Table, Tooltip } from 'antd'
import { LeftOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import GeneralTable from '@/components/general-table'
import moment, {Moment} from "moment";

const BusinessBoard: React.FC = () => {
  const [statisticalType, setStatisticalType] = useState<string>('1')
  const [detail, setDetail] = useState<boolean>(false)
  const [id,setId] = useState('');
  const showDetail = (row: { companyId: React.SetStateAction<string> }) => {
    setId(row.companyId)
    setDetail(true)
  }
  const tableRef = React.useRef<HTMLDivElement>(null);
  const detailTableRef = React.useRef<HTMLDivElement>(null);
  const columns = [
    {
      title: '公司名称',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text: string, row: any) => {
        return (
          <span onClick={() => showDetail(row)} className={styles.tableLink}>
            {text}
          </span>
        )
      },
    },
    {
      title: '立项',
      dataIndex: 'establishmentQuntity',
      key: 'establishmentQuntity',
    },
    {
      title: '勘察',
      dataIndex: 'surveyQuntity',
      key: 'surveyQuntity',
    },
    {
      title: '设计',
      dataIndex: 'designQuntity',
      key: 'designQuntity',
    },
    {
      title: '造价',
      dataIndex: 'economyQuntity',
      key: 'economyQuntity',
    },
    {
      title: '评审',
      dataIndex: 'reviewQuntity',
      key: 'reviewQuntity',
    },
    {
      title: '结项',
      dataIndex: 'closeQuntity',
      key: 'closeQuntity',
    },
    {
      title: '合计',
      dataIndex: 'totalQuntity',
      key: 'totalQuntity',
    },
    {
      width: 300,
      title: () => {
        return (
          <span>
            综合进度&nbsp;
            <Tooltip title="综合进度代表该公司所有项目进度平均值">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        )
      },
      dataIndex: 'progress',
      key: 'progress',
      render: (progress:number) => {
        return <div style={{
          padding: '0 20px 00 10px'
        }}>
          <Progress percent={Number(progress.toFixed(0))} />
        </div>
      },
    },
    {
      title: '最近操作时间',
      width:150,
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
      render: (time:Moment)=>{
        return moment(time).format('YYYY-MM-DD')
      }
    },
  ]
  const detailColumns = [
    {
      title: '序号',
      width: 50,
      index: 'number',
      render: (text: any, record: any, index: number) => `${index + 1}`,
      align: 'center' as 'center',
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: '立项/执行公司',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: '计划天数',
      dataIndex: 'planDays',
      key: 'planDays',
      render: (day:number)=>{
        return <span>{day}天</span>
      }
    },
    {
      title: '当前阶段',
      dataIndex: 'statusText',
      key: 'statusText',
    },
    {
      title: '项目进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress:number) => {
        return <div style={{
          padding: '0 20px 00 10px'
        }}>
          <Progress percent={Number(progress.toFixed(0))} />
        </div>
      },
    },
    {
      title: '超期情况',
      dataIndex: 'overdueDays',
      key: 'overdueDays',
      render: (day:number)=>{
        return <span>已逾期{day}天</span>
      }
    },
    {
      title: '最近操作时间',
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
      render: (time:Moment)=>{
        return moment(time).format('YYYY-MM-DD')
      }
    },
  ]
  const reset = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search();
    }
  }
  const rowSummary = (pageData: any[] | readonly object[] , name: string) => {
    // @ts-ignore
    return pageData?.reduce((total: number, next: { [x: string]: any }) => {
      if (isNaN(total)) {
        return Number(total[name]) + Number(next[name])
      } else {
        return Number(total) + Number(next[name])
      }
    },0)
  }
  useEffect(() => {
    reset()
  },[statisticalType])
  useEffect(()=>{
    if (detail && detailTableRef && detailTableRef.current){
      // @ts-ignore
      detailTableRef.current.search()
    } else {
      setId('')
      if (tableRef && tableRef.current){
        // @ts-ignore
        tableRef.current.refresh()
      }
    }
  },[detail])
  return (
    <PageCommonWrap noPadding>
      <div className={styles.businessBoard}>
        <div className={styles.businessBoardTitle}>业务看板</div>
        <br />
        <div>
          统计模式 :&nbsp;&nbsp;
          <Select
            defaultValue="1"
            style={{ width: 200 }}
            disabled={detail}
            onSelect={(val) => setStatisticalType(val)}
          >
            <Select.Option value="1">立项统计</Select.Option>
            <Select.Option value="2">执行统计</Select.Option>
          </Select>
        </div>
        {detail ? (
          <div className={styles.tableTitleBack} onClick={() => setDetail(false)}>
            <LeftOutlined /> 综合进度
          </div>
        ) : (
          <div className={styles.tableTitle}>综合进度</div>
        )}
        <div>
          {detail  &&
            <GeneralTable
              ref={detailTableRef}
              rowKey={'companyId'}
              columns={detailColumns}
              extractParams={{
                statisticalType:Number(statisticalType),
                companyId:id
              }}
              url={'/BusinessBoard/GetProjectProgress'}
               />
          }
          {
            !detail && <GeneralTable
              ref={tableRef}
              rowKey={'companyId'}
              columns={columns}
              url={'/BusinessBoard/GetSyntheticalProgress'}
              extractParams={{
                statisticalType:Number(statisticalType)
              }}
              summary={(pageData) => {
                return (
                  <>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={2}>
                        {rowSummary(pageData, 'establishmentQuntity')}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3}>
                        {rowSummary(pageData, 'surveyQuntity')}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={4}>
                        {rowSummary(pageData, 'designQuntity')}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5}>
                        {rowSummary(pageData, 'economyQuntity')}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={6}>
                        {rowSummary(pageData, 'reviewQuntity')}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={7}>
                        {rowSummary(pageData, 'closeQuntity')}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={8}>
                        {rowSummary(pageData, 'totalQuntity')}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={9}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={10}>-</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            />
          }
        </div>
      </div>
    </PageCommonWrap>
  )
}

export default BusinessBoard
