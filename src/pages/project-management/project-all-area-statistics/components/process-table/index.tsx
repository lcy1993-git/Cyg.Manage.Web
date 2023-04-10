import React from 'react'
import { Table } from 'antd'
import styles from './index.less'
import { useState } from 'react'
import { useRequest, useSize } from 'ahooks'
import { tableCommonRequest } from '@/services/table'
import { useMemo } from 'react'
import { Pagination } from 'antd'
import { useRef } from 'react'
import EmptyTip from '@/components/empty-tip'
import { useEffect } from 'react'
import uuid from 'node-uuid'

interface ProcessTableProps {
  url: string
  extraParams?: any
}

const withProcessTable =
  <P extends {}>(WrapperComponent: React.ComponentType<P>) =>
  (props: P & ProcessTableProps) => {
    const { url, extraParams, ...rest } = props
    const [currentPage, setCurrentPage] = useState<number>(1)
    const { data, run, loading } = useRequest(tableCommonRequest, {
      manual: true,
    })

    const contentRef = useRef<HTMLDivElement>(null)
    const contentSize = useSize(contentRef)

    const currentPageSize = useMemo(() => {
      if (!contentSize.height) return 0
      return Math.floor(contentSize.height / 38) - 1
    }, [contentSize.height])

    const tableResultData = useMemo(() => {
      if (data && data.items && data.items.length > 0) {
        const { items, pageIndex, pageSize, total } = data

        let handleItems = [...items]

        if (items.length < currentPageSize) {
          const copyObject = { ...items[0] }
          const emptyObject = { empty: true }
          Object.keys(copyObject).forEach((item) => {
            emptyObject[item] = ''
          })
          const emptyObjectArray = new Array(currentPageSize - items.length).fill(emptyObject)

          handleItems = [...items, ...emptyObjectArray]
        }

        const afterHanldeItems = handleItems.map((item, index) => {
          return {
            ...item,
            index: Math.floor((pageIndex - 1) * pageSize + index + 1),
            key: uuid.v1(),
          }
        })

        return {
          items: afterHanldeItems ?? [],
          pageIndex,
          total,
          dataStartIndex: total !== 0 ? Math.floor((pageIndex - 1) * pageSize + 1) : 0,
          dataEndIndex: Math.floor((pageIndex - 1) * pageSize + (items ?? []).length),
        }
      }
      return {
        items: [],
        pageIndex: 1,
        total: 0,
        dataStartIndex: 0,
        dataEndIndex: 0,
      }
    }, [JSON.stringify(data)])

    const currentPageChange = (page: any, size: any) => {
      // 判断当前page是否改变, 没有改变代表是change页面触发
      if (currentPageSize === size) {
        setCurrentPage(page === 0 ? 1 : page)
      }
    }

    useEffect(() => {
      if (currentPageSize) {
        run({
          url,
          pageSize: currentPageSize,
          pageIndex: currentPage,
          extraParams,
          postType: 'body',
          requestSource: 'project',
        })
      }
    }, [currentPageSize, currentPage, JSON.stringify(extraParams)])

    useEffect(() => {
      if (extraParams && currentPageSize) {
        setCurrentPage(1)
        run({
          url,
          pageSize: currentPageSize,
          pageIndex: 1,
          extraParams,
          postType: 'body',
          requestSource: 'project',
        })
      }
    }, [JSON.stringify(extraParams)])

    return (
      <div className={styles.processTable}>
        <div className={styles.processTableContent} ref={contentRef}>
          <WrapperComponent
            bordered={true}
            dataSource={tableResultData.items}
            loading={loading}
            pagination={false}
            rowKey={'key'}
            locale={{
              emptyText: <EmptyTip className="pt20 pb20" />,
            }}
            {...(rest as unknown as P)}
          />
        </div>
        <div className={styles.processTablePaging}>
          <div className={styles.processTablePagingLeft}>
            <span>显示第</span>
            <span className={styles.importantTip}>{tableResultData.dataStartIndex}</span>
            <span>到第</span>
            <span className={styles.importantTip}>{tableResultData.dataEndIndex}</span>
            <span>条记录,总共</span>
            <span className={styles.importantTip}>{tableResultData.total}</span>
            <span>条记录</span>
          </div>
          <div className={styles.processTablePagingRight}>
            <Pagination
              pageSize={currentPageSize}
              onChange={currentPageChange}
              size="small"
              total={tableResultData.total}
              showSizeChanger={false}
              current={currentPage}
              hideOnSinglePage={true}
              showQuickJumper
            />
          </div>
        </div>
      </div>
    )
  }

export default withProcessTable(Table)
