import TableSearch from '@/components/table-search'
import { getProjectTableList } from '@/services/project-management/all-project'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useControllableValue, useRequest } from 'ahooks'
import { Button, Input, message, Modal, Pagination, Spin, Table } from 'antd'
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import styles from './index.less'
const { Search } = Input

interface MigrateDataModalProps {
  visible: boolean
  // projectIds: string[]
  onChange: Dispatch<SetStateAction<boolean>>
  // finishEvent: () => void
}

const MigrateDataModal: React.FC<MigrateDataModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [keyWord, setKeyWord] = useState('')
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [tableData, setTableData] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  // const { finishEvent, projectIds } = props
  const { data, loading, run: getDataList } = useRequest(
    () => {
      return getProjectTableList({
        statisticalCategory: '-1',
        pageIndex: currentPage,
        pageSize: pageSize,
        keyWord: keyWord,
      })
    },
    {
      manual: true,
      onSuccess: (res: any) => {
        const data = res.items.map((item: any) => {
          return {
            ...item,
            children: item.projects,
            clearRadio: true,
          }
        })
        setTableData(data)
      },
    }
  )

  const tableColumns = [
    {
      dataIndex: 'name',
      index: 'name',
      title: '项目',
    },
  ]
  const sureCopyMemberAndChangeState = () => {
    // console.log(2)
  }

  const handleOK = async () => {
    if (tableSelectRows && tableSelectRows.length === 0) {
      message.warning('请选择需要迁入的工程')
      return
    }

    // const id = tableSelectRows[0].id
    // console.log(id)
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '迁移成功，是否复制源项目的勘察人员，并修改项目为“已勘察”',
      okText: '确认',
      cancelText: '取消',
      onOk: sureCopyMemberAndChangeState,
    })
  }

  const closeEvent = () => {
    setState(false)
  }

  useEffect(() => {
    if (state) {
      setTableSelectRows([])
      getDataList()
    }
  }, [state])
  const rowSelection: any = {
    onSelect: (record: any, selected: any, selectedRows: any) => {
      setTableSelectRows(selectedRows)
    },
    type: 'radio',
    renderCell: (checked: any, record: any, index: any, originNode: any) => {
      return !record.clearRadio ? originNode : null
    },
  }
  // 列显示处理
  const currentPageChange = (page: any, size: any) => {
    // 判断当前page是否改变, 没有改变代表是change页面触发
    if (pageSize === size) {
      setCurrentPage(page === 0 ? 1 : page)
    }
  }

  const pageSizeChange = (page: any, size: any) => {
    setCurrentPage(1)
    setPageSize(size)
  }
  const res = useMemo(() => {
    if (data) {
      const { items, pageIndex, pageSize, total } = data as any
      return {
        items: items ?? [],
        pageIndex,
        pageSize,
        total,
        dataStartIndex: Math.floor((pageIndex - 1) * pageSize + 1),
        dataEndIndex: Math.floor((pageIndex - 1) * pageSize + (items ?? []).length),
      }
    }
    return {
      items: [],
      pageIndex: 1,
      pageSize: 20,
      total: 0,
      dataStartIndex: 0,
      dataEndIndex: 0,
    }
  }, [JSON.stringify(data)])
  useEffect(() => {
    getDataList()
  }, [pageSize, currentPage])

  return (
    <Modal
      maskClosable={false}
      title="迁移数据"
      width={750}
      visible={state as boolean}
      destroyOnClose
      footer={null}
      onCancel={() => closeEvent()}
      bodyStyle={{ padding: '20px 24px 0px', height: '600px', overflowY: 'auto' }}
    >
      <Spin spinning={loading}>
        <div className={styles.wrap}>
          <div className={styles.toolBarWrap}>
            <TableSearch className="mr7" width="258px">
              <Search
                placeholder="请输入工程名称"
                enterButton
                value={keyWord}
                onChange={(e) => setKeyWord(e.target.value)}
                onSearch={() => getDataList()}
              />
            </TableSearch>
            <Button type="primary" onClick={() => handleOK()}>
              确认迁移
            </Button>
          </div>
          <Table
            columns={tableColumns}
            rowSelection={{ ...rowSelection }}
            dataSource={tableData}
            rowKey="id"
            pagination={false}
          />
          <div className={styles.cyGeneralTablePaging}>
            <div className={styles.cyGeneralTablePagingLeft}>
              <span>显示第</span>
              <span className={styles.importantTip}>{res.dataStartIndex}</span>
              <span>到第</span>
              <span className={styles.importantTip}>{res.dataEndIndex}</span>
              <span>条记录,总共</span>
              <span className={styles.importantTip}>{res.total}</span>
              <span>条记录</span>
            </div>
            <div>
              <Pagination
                pageSize={pageSize}
                onChange={currentPageChange}
                size="small"
                total={res.total}
                current={currentPage}
                showSizeChanger
                showQuickJumper
                onShowSizeChange={pageSizeChange}
              />
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  )
}

export default MigrateDataModal
