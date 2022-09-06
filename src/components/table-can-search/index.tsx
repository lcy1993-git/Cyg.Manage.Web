import { tableCommonRequest } from '@/services/table'
import { useRequest } from 'ahooks'
import { Pagination, Table } from 'antd'

import type { Ref } from 'react'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

import EmptyTip from '../empty-tip'
import styles from './index.less'

interface GeneralTableProps {
  url: string
  extractParams?: object
  columns: any[]
  rowKey?: string
  requestSource?: 'project' | 'common' | 'resource' | 'tecEco' | 'tecEco1' | 'grid'
  postType?: 'body' | 'query'
}

const withSearchTable =
  <P extends {}>(WrapperComponent: React.ComponentType<P>) =>
  (props: P & GeneralTableProps, ref: Ref<any>) => {
    const {
      url,
      columns = [],
      extractParams,
      rowKey = 'id',
      requestSource = 'project',
      postType = 'body',
      ...rest
    } = props

    const [pageSize, setPageSize] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState<number>(1)

    const [finallyColumns, setFinalyColumns] = useState<any[]>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
    const [selectedRow, setSelectedRow] = useState<any[]>([])
    const tableRef = useRef<HTMLDivElement>(null)

    const { data, run, loading } = useRequest(tableCommonRequest, {
      manual: true,
    })
    useImperativeHandle(ref, () => ({
      getCheckedList: () => {
        return selectedRow
      },
    }))
    const tableResultData = useMemo(() => {
      if (data) {
        const { items, pageIndex, pageSize, total } = data
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
      }
    }, [JSON.stringify(data)])

    const rowSelection = {
      onChange: (values: any[], selectedRows: any[]) => {
        setSelectedRowKeys(
          selectedRows.map((item) => {
            return item[rowKey]
          })
        )
        setSelectedRow(selectedRows)
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

    useEffect(() => {
      if (url === '') return
      run({
        url,
        extraParams: extractParams,
        pageIndex: currentPage,
        pageSize,
        requestSource,
        postType,
      })
    }, [pageSize, currentPage])

    useEffect(() => {
      const newColumns = columns.map((item) => ({ ...item, checked: true }))
      setFinalyColumns(newColumns)
    }, [JSON.stringify(columns)])

    return (
      <div className={styles.cyGeneralTable} ref={tableRef}>
        <div className={styles.cyGeneralTableConetnt}>
          <WrapperComponent
            bordered={true}
            dataSource={tableResultData.items}
            pagination={false}
            rowKey={rowKey}
            columns={finallyColumns.filter((item) => item.checked)}
            loading={loading}
            locale={{
              emptyText: <EmptyTip className="pt20 pb20" />,
            }}
            rowSelection={{
              type: 'checkbox',
              columnWidth: '38px',
              selectedRowKeys,
              ...rowSelection,
            }}
            {...(rest as unknown as P)}
          />
        </div>

        {
          <div className={`${styles.cyGeneralTablePaging} ${styles.paddingClas}`}>
            <div className={styles.cyGeneralTablePagingLeft}>
              <span>显示第</span>
              <span className={styles.importantTip}>{tableResultData.dataStartIndex}</span>
              <span>到第</span>
              <span className={styles.importantTip}>{tableResultData.dataEndIndex}</span>
              <span>条记录,总共</span>
              <span className={styles.importantTip}>{tableResultData.total}</span>
              <span>条记录</span>
            </div>
            <div className={styles.cyGeneralTablePagingRight}>
              <Pagination
                pageSize={pageSize}
                onChange={currentPageChange}
                size="small"
                total={tableResultData.total}
                current={currentPage}
                showSizeChanger
                showQuickJumper
                onShowSizeChange={pageSizeChange}
              />
            </div>
          </div>
        }
      </div>
    )
  }

export default forwardRef(withSearchTable(Table))
