import CommonTitle from '@/components/common-title'
import EmptyTip from '@/components/empty-tip'
import PageCommonWrap from '@/components/page-common-wrap'
import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { history } from 'umi'

import { useLayoutStore } from '@/layouts/context'
import { getResourceLibApprovalList } from '@/services/resource-config/approval'
import { useRequest } from 'ahooks'
import moment from 'moment'
import styles from './index.less'

interface Props {}
const statusMap = [
  {
    value: 0,
    text: '未定义',
  },
  {
    value: 10,
    text: '待审批',
  },
  {
    value: 20,
    text: '通过',
  },
  {
    value: 30,
    text: '未通过',
  },
]
// 这里协商的类型命名在approval-manage里使用
const typeMap = [
  {
    value: 0,
    text: 'component',
  },
  {
    value: 1,
    text: 'material',
  },
  {
    value: 2,
    text: 'pole-type',
  },
  {
    value: 3,
    text: 'category',
  },
  {
    value: 4,
    text: 'cable-well',
  },
  {
    value: 5,
    text: 'cable-channel',
  },
]
const ApprovalList: React.FC<Props> = (props) => {
  const [tableData, setTableData] = useState<any[]>([])
  const { resourceLibApprovalListFlag } = useLayoutStore()
  const { run: getList, loading: tableListLoading } = useRequest(
    () => getResourceLibApprovalList(),
    {
      manual: true,
      onSuccess: (res: any) => {
        setTableData(res)
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
      dataIndex: 'createdOn',
      index: 'createdOn',
      title: '创建时间',
      width: 200,
      render: (text: any, record: any) => {
        return moment(text).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      dataIndex: 'targetName',
      index: 'targetName',
      title: '目标库',
      width: 280,
    },
    {
      dataIndex: 'state',
      index: 'state',
      title: '审批状态',
      width: 140,
      render: (text: any, record: any) => {
        return statusMap.find((item) => item.value === text)?.text
      },
    },
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
          <span>
            {record.state === 10 && (
              <span
                className="canClick"
                onClick={() => {
                  const storage = window.localStorage
                  storage.setItem('approval-manage-data', JSON.stringify(record.data))
                  history.push({
                    pathname: `/standard-config/approval-manage?type=${
                      typeMap.find((item) => item.value === record.dataType)?.text
                    }&id=${record.id}`,
                  })
                }}
              >
                <u>审批</u>
              </span>
            )}
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
