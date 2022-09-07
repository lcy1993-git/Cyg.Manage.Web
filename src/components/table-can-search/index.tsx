import TableSearch from '@/components/table-search'
import UrlSelect from '@/components/url-select'
import { tableCommonRequest } from '@/services/table'
import { useRequest } from 'ahooks'
import { Input, Pagination, Table } from 'antd'
import type { Ref } from 'react'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import EmptyTip from '../empty-tip'
import styles from './index.less'
const { Search } = Input

interface GeneralTableProps {
  url: string
  extractParams?: object
  columns: any[]
  rowKey?: string
  requestSource?: 'project' | 'common' | 'resource' | 'tecEco' | 'tecEco1' | 'grid'
  postType?: 'body' | 'query'
  libId: string
  categoryKey: string
  name: string
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
      libId,
      categoryKey,
      name,
      ...rest
    } = props

    const [pageSize, setPageSize] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState<number>(1)

    const [finallyColumns, setFinalyColumns] = useState<any[]>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
    const [selectedRow, setSelectedRow] = useState<any[]>([])
    const [searchKeyWord, setSearchKeyWord] = useState<string>()
    const [category, setCategory] = useState<string>()
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
      getList()
    }, [pageSize, currentPage, category])

    const getList = () => {
      const params = { ...extractParams }
      params[categoryKey] = category
      params['keyWord'] = searchKeyWord
      run({
        url,
        extraParams: params,
        pageIndex: currentPage,
        pageSize,
        requestSource,
        postType,
      })
    }

    useEffect(() => {
      const newColumns = columns.map((item) => ({ ...item, checked: true }))
      setFinalyColumns(newColumns)
    }, [JSON.stringify(columns)])

    return (
      <div className={styles.cyGeneralTable} ref={tableRef}>
        <div className={styles.cyGeneralTableButtonContent}>
          <div className={styles.cyGeneralTableButtonLeftContent}>
            <TableSearch width="230px">
              <Search
                value={searchKeyWord}
                onChange={(e) => setSearchKeyWord(e.target.value)}
                onSearch={() => getList()}
                enterButton
                placeholder={`请输入${name}信息`}
              />
            </TableSearch>
            {name === '组件' ? (
              <TableSearch marginLeft="20px" label="设备分类" width="220px">
                <UrlSelect
                  allowClear
                  showSearch
                  requestSource="resource"
                  url="/Component/GetDeviceCategory"
                  titlekey="key"
                  valuekey="value"
                  placeholder="请选择"
                  onChange={(value: any) => setCategory(value)}
                />
              </TableSearch>
            ) : (
              <TableSearch marginLeft="20px" label="类别" width="220px">
                <UrlSelect
                  allowClear
                  showSearch
                  requestSource="resource"
                  url="/Material/GetMaterialTypeList"
                  titlekey="key"
                  valuekey="value"
                  placeholder="请选择"
                  onChange={(value: any) => {
                    setCategory(value)
                  }}
                  extraParams={{ libId: libId }}
                  postType="query"
                  requestType="post"
                />
              </TableSearch>
            )}
          </div>
        </div>
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
