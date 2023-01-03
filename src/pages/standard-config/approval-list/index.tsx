import CommonTitle from '@/components/common-title'
import EmptyTip from '@/components/empty-tip'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
import { Input, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { history } from 'umi'

import { useLayoutStore } from '@/layouts/context'
import { getResourceLibApprovalGroupList } from '@/services/resource-config/approval'
import { useRequest } from 'ahooks'
import styles from './index.less'
const { Search } = Input

interface Props {}
// const statusMap = [
//   {
//     value: 0,
//     text: '未定义',
//   },
//   {
//     value: 10,
//     text: '待审批',
//   },
//   {
//     value: 20,
//     text: '通过',
//   },
//   {
//     value: 30,
//     text: '未通过',
//   },
// ]
// // 这里协商的类型命名在approval-manage里使用
// const typeMap = [
//   {
//     value: 0,
//     text: 'component',
//   },
//   {
//     value: 1,
//     text: 'material',
//   },
//   {
//     value: 2,
//     text: 'pole-type',
//   },
//   {
//     value: 3,
//     text: 'category',
//   },
//   {
//     value: 4,
//     text: 'cable-well',
//   },
//   {
//     value: 5,
//     text: 'cable-channel',
//   },
// ]
const ApprovalList: React.FC<Props> = (props) => {
  const [tableData, setTableData] = useState<any[]>([])
  const [keyword, setKeyword] = useState<string>('')
  const { resourceLibApprovalListFlag } = useLayoutStore()
  const { run: getList, loading: tableListLoading } = useRequest(
    () => getResourceLibApprovalGroupList({ keyword }),
    {
      manual: true,
      onSuccess: (res: any) => {
        setTableData(res)
        // setTableData([{}])
      },
    }
  )
  // useMount(() => {
  //   getList()
  // })
  useEffect(() => {
    getList()
  }, [resourceLibApprovalListFlag])
  const columns = [
    {
      dataIndex: 'createdByName',
      index: 'createdByName',
      title: '审批创建人',
      width: 200,
      // render: (text: any, record: any) => {
      //   return moment(text).format('YYYY-MM-DD HH:mm:ss')
      // },
    },
    {
      dataIndex: 'targetName',
      index: 'targetName',
      title: '目标库',
      width: 280,
    },
    {
      dataIndex: 'count',
      index: 'count',
      title: '数量',
      width: 280,
    },
    // {
    //   dataIndex: 'state',
    //   index: 'state',
    //   title: '审批状态',
    //   width: 140,
    //   render: (text: any, record: any) => {
    //     return statusMap.find((item) => item.value === text)?.text
    //   },
    // },
    // {
    //   dataIndex: 'failRemark',
    //   index: 'failRemark',
    //   title: '备注',
    //   width: 600,
    // },

    {
      dataIndex: 'action',
      title: '操作',
      width: 200,
      render: (text: any, record: any) => {
        return (
          <span
            className="canClick"
            onClick={() => {
              const storage = window.localStorage
              storage.setItem('approval-manage-data', JSON.stringify(record.data))
              history.push({
                pathname: `/standard-config/approval-manage?createdBy=${record.createdBy}&targetId=${record.targetId}`,
              })
            }}
          >
            <u>审批</u>
          </span>
        )
      },
    },
  ]

  return (
    <PageCommonWrap>
      <div className={styles.cyGeneralTableTitleContnet}>
        <div className={styles.cyGeneralTableTitleShowContent}>
          {<CommonTitle>{'资源库管理'}</CommonTitle>}
        </div>
      </div>
      <div className={styles.searchWrap}>
        <TableSearch width="230px">
          <Search
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onSearch={() => getList()}
            enterButton
            placeholder="请输入关键字进行搜索"
          />
        </TableSearch>
      </div>
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="id"
        pagination={false}
        bordered={true}
        loading={tableListLoading}
        locale={{
          emptyText: <EmptyTip className="pt20 pb20" />,
        }}
      />
    </PageCommonWrap>
  )
}

export default ApprovalList
