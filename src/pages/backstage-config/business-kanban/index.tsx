import React, { useState } from 'react'
import PageCommonWrap from '@/components/page-common-wrap'
import styles from './index.less'
import { Progress, Select, Table, Tooltip } from 'antd'
import { LeftOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import GeneralTable from '@/components/general-table'

const BusinessBoard: React.FC = () => {
  const [value, setValue] = useState<string>('project')
  const [detail, setDetail] = useState<boolean>(false)
  const showDetail = () => {
    setDetail(true)
    setDetail(true)
  }
  const columns = [
    {
      title: '公司名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, row: any) => {
        return (
          <span onClick={() => showDetail()} className={styles.tableLink}>
            {text}
          </span>
        )
      },
    },
    {
      title: '立项',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '勘察',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '设计',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '造价',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '评审',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '结项',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '合计',
      dataIndex: 'address',
      key: 'address',
    },
    {
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
      dataIndex: 'address',
      key: 'address',
      render: () => {
        return <Progress percent={30} />
      },
    },
    {
      title: '最近操作时间',
      dataIndex: 'address',
      key: 'address',
    },
  ]
  const detailColumns = [
    {
      title: '序号',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '项目名称',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '立项/执行公司',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '计划天数',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '当前阶段',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '项目进度',
      dataIndex: 'address',
      key: 'address',
      render: () => {
        return <Progress percent={30} />
      },
    },
    {
      title: '超期情况',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '最近操作时间',
      dataIndex: 'address',
      key: 'address',
    },
  ]
  const data = [
    {
      key: '1',
      id: '1',
      name: 'John Brown',
      age: 32,
      address: 1,
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      id: '2',
      name: 'Jim Green',
      age: 42,
      address: 2,
      tags: ['loser'],
    },
    {
      key: '3',
      id: '3',
      name: 'Joe Black',
      age: 32,
      address: 3,
      tags: ['cool', 'teacher'],
    },
  ]
  const rowSummary = (pageData: any[] | readonly object[], name: string) => {
    // @ts-ignore
    return pageData?.reduce((total: number, next: { [x: string]: any }) => {
      if (isNaN(total)) {
        return Number(total[name]) + Number(next[name])
      } else {
        return Number(total) + Number(next[name])
      }
    })
  }
  return (
    <PageCommonWrap noPadding>
      <div className={styles.businessBoard}>
        {value}
        <div className={styles.businessBoardTitle}>业务看板</div>
        <br />
        <div>
          统计模式 :&nbsp;&nbsp;
          <Select
            defaultValue="project"
            style={{ width: 200 }}
            disabled={detail}
            onSelect={(val) => setValue(val)}
          >
            <Select.Option value="project">立项统计</Select.Option>
            <Select.Option value="execution">执行统计</Select.Option>
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
          {detail ? (
            <GeneralTable rowKey={'id'} columns={detailColumns} url={''} dataSource={data} />
          ) : (
            <GeneralTable
              rowKey={'id'}
              columns={columns}
              url={''}
              dataSource={data}
              summary={(pageData) => {
                return (
                  <>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={2}>
                        {rowSummary(pageData, 'age')}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3}>
                        {rowSummary(pageData, 'address')}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={4}>
                        {rowSummary(pageData, 'address')}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5}>
                        {rowSummary(pageData, 'address')}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={6}>
                        {rowSummary(pageData, 'address')}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={7}>
                        {rowSummary(pageData, 'address')}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={8}>
                        {rowSummary(pageData, 'address')}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={9}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={10}>
                        {rowSummary(pageData, 'address')}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            />
          )}
        </div>
      </div>
    </PageCommonWrap>
  )
}

export default BusinessBoard
