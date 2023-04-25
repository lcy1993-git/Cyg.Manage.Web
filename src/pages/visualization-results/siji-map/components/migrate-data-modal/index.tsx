import TableSearch from '@/components/table-search'
import { getMoveData } from '@/pages/visualization-results/utils/mapClick'
import { getProjectTableList } from '@/services/project-management/all-project'
import { dataMigrate } from '@/services/visualization-results/side-tree'
import { useControllableValue, useRequest } from 'ahooks'
import { Button, Input, message, Modal, Pagination, Spin, Table } from 'antd'
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useContainer } from '../../mobx-store'
import styles from './index.less'
const { Search } = Input

interface MigrateDataModalProps {
  visible: boolean
  projectIds: string[]
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
  const [loadingMigrate, setLoadingMigrate] = useState<boolean>(false)
  const store = useContainer()
  const { vState } = store
  const { map } = vState

  const { projectIds } = props
  const {
    data,
    loading,
    run: getDataList,
  } = useRequest(
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
  // const { run: dataMigrateRun } = useRequest(dataMigrate, { manual: true })

  const tableColumns = [
    {
      dataIndex: 'name',
      index: 'name',
      title: '项目',
    },
  ]
  // const sureCopyMemberAndChangeState = () => {
  //   const id = tableSelectRows[0].id
  //   copyMember(projectIds[0], id).then((res) => {
  //     if (res.isSuccess) {
  //       if (tableSelectRows[0].stateInfo?.status === 14) {
  //         message.success('操作成功')
  //         setState(false)
  //       }
  //     } else {
  //       message.error(res.message)
  //     }
  //   })
  // }

  const handleOK = async () => {
    if (tableSelectRows && tableSelectRows.length === 0) {
      message.warning('请选择需要迁入的项目')
      return
    }

    const id = tableSelectRows[0].id
    const data = getMoveData(map)
    if (!data) {
      message.error('请选择需要迁移的数据')
      return
    }
    const surveyGisData = {}
    const planGisData = {}
    for (let i = 0; i < data.length; i++) {
      let str = data[i].values_.id_
      const id = data[i].values_.id
      let arr = str.split('.')[0].split('_')
      let type = arr.shift()
      let key = ''
      for (let i = 0; i < arr.length; i++) {
        if (i === 0) {
          key += arr[i]
        } else {
          key += arr[i].slice(0, 1).toUpperCase() + arr[i].slice(1)
        }
      }
      key += 'Ids'
      if (type === 'survey') {
        if (!surveyGisData[key]) {
          surveyGisData[key] = []
        }
        surveyGisData[key].push()
        surveyGisData[key].push(id)
      }
      if (type === 'plan') {
        if (!planGisData[key]) {
          planGisData[key] = []
        }
        planGisData[key].push()
        planGisData[key].push(id)
      }
    }
    setLoadingMigrate(true)
    await dataMigrate(projectIds[0], id, surveyGisData, planGisData)
      .then((res: any) => {
        // isSuccess
        if (res.isSuccess) {
          message.success('数据迁移成功')
          setState(false)
          // if (tableSelectRows[0].stateInfo?.status === 14) {
          //   Modal.confirm({
          //     title: '提示',
          //     icon: <ExclamationCircleOutlined />,
          //     content: '数据迁移成功，是否复制源项目的勘察人员，并修改项目状态为“已勘察”',
          //     okText: '确认',
          //     cancelText: '取消',
          //     onOk: sureCopyMemberAndChangeState,
          //   })
          // }
        } else {
          message.error(res.message)
        }
      })
      .finally(() => {
        setLoadingMigrate(false)
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
                placeholder="请输入工程/项目名称/项目编码"
                enterButton
                value={keyWord}
                onChange={(e) => setKeyWord(e.target.value)}
                onSearch={() => getDataList()}
              />
            </TableSearch>
            <Button type="primary" onClick={() => handleOK()} loading={loadingMigrate}>
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
