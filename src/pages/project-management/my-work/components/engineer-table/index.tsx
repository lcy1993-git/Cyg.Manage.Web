import EmptyTip from '@/components/empty-tip'
import { getTableData } from '@/services/project-management/all-project'
import { delay } from '@/utils/utils'
import { useRequest } from 'ahooks'
import { Checkbox, Pagination, Spin } from 'antd'
import React, {
  forwardRef,
  Key,
  memo,
  Ref,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useMyWorkStore } from '../../context'
import ParentRow from '../virtual-table/ParentRow'
import VirtualTable, { VirtualTableInstance } from '../virtual-table/VirtualTable'
import styles from './index.less'

interface EngineerTableProps {
  // TODO
  searchParams?: any
  // TODO
  columns: any
  // pagingSlot
  pagingSlot?: React.ReactNode
  // TODO
  parentColumns: any
  // TODO
  getSelectRowKeys?: (selectKeys: Key[]) => void
  // TODO
  getSelectRowData?: (selectRowData: any[]) => void
  // url
  url: string
}

const ROW_HEIGHT = 40

const EngineerTable = (props: EngineerTableProps, ref: Ref<any>) => {
  const {
    url,
    columns,
    parentColumns,
    pagingSlot,
    searchParams,
    getSelectRowKeys,
    getSelectRowData,
  } = props
  const [pageInfo, setPageInfo] = useState({
    pageSize: 10,
    pageIndex: 1,
  })
  //@ts-ignore
  const { userType } = JSON.parse(localStorage.getItem('userInfo'))
  const [tableShowDataSource, setTableShowDataSource] = useState<any[]>([])
  const [allCheckValue, setAllCheckValue] = useState<boolean>(false)
  const [indeterminate, setIndeterminate] = useState<boolean>(false)
  const { sideVisible, selectedFavId, currentClickTabType } = useMyWorkStore()
  const { data: tableData, run, loading, cancel } = useRequest(getTableData, {
    manual: true,
    throttleInterval: 500,
  })

  const cache = useRef<any[]>([])
  const tableRef = useRef<VirtualTableInstance>(null)

  const tableResultData = useMemo(() => {
    if (tableData) {
      const { pageIndex: resPageIndex, pageSize: resPageSize, total, items } = tableData
      // const { pageIndex: resPageIndex, pageSize: resPageSize, total } = pagedData
      const afterHandleItems = (items ?? []).reduce((p: any[], c: any) => {
        // _parent 父级
        // _header 表头
        const newProjects = c.projects.map((item: any) => ({ ...item, engineerInfo: c }))
        p.push({ ...c, _parent: true }, { _header: true }, ...newProjects)
        return p
      }, [])
      if (cache && cache.current) {
        cache.current = afterHandleItems
      }
      setTableShowDataSource(afterHandleItems)
      return {
        items: afterHandleItems,
        pageIndex: resPageIndex,
        pageSize: resPageSize,
        total,
        dataStartIndex: Math.floor((resPageIndex - 1) * pageInfo.pageSize + 1),
        dataEndIndex: Math.floor((resPageIndex - 1) * pageInfo.pageSize + (items ?? []).length),
        engineerLen: items?.filter((item: any) => item.projects).length,
        projectLen:
          items
            ?.filter((item: any) => item.projects && item.projects.length > 0)
            .map((item: any) => item.projects)
            .flat().length ?? 0,
      }
    }
    return {
      items: [],
      pageIndex: 1,
      pageSize: 20,
      total: 0,
      dataStartIndex: 0,
      dataEndIndex: 0,
      projectLen: 0,
    }
  }, [pageInfo.pageSize, tableData])

  // pageIndex变化
  const currentPageChangeEvent = (page: any, size: any) => {
    // 判断当前page是否改变, 没有改变代表是change页面触发
    if (pageInfo.pageSize === size) {
      setPageInfo({
        pageSize: size,
        pageIndex: page === 0 ? 1 : page,
      })
      cancel()
      run(url, {
        ...searchParams,
        pageIndex: page,
        pageSize: size,
      })
      emptyTableSelect()
    }
  }
  // pageSize变化
  const currentPageSizeChangeEvent = (page: any, size: any) => {
    setPageInfo({
      pageIndex: 1,
      pageSize: size,
    })
    cancel()
    run(url, {
      ...searchParams,
      pageIndex: 1,
      pageSize: size,
    })

    emptyTableSelect()
  }

  useImperativeHandle(ref, () => ({
    // 刷新
    refresh: () => {
      cancel()
      run(url, {
        ...searchParams,
        ...pageInfo,
      })
      emptyTableSelect()
    },
    // 按照目前的参数进行搜索
    search: () => {
      setPageInfo({
        ...pageInfo,
        pageIndex: 1,
      })
      cancel()
      run(url, {
        ...searchParams,
        ...pageInfo,
        pageIndex: 1,
      })
      emptyTableSelect()
    },
    // 按照传入的参数进行搜索
    searchByParams: (params: object) => {
      setPageInfo({
        ...pageInfo,
        pageIndex: 1,
      })
      cancel()
      run(url, {
        ...params,
        ...pageInfo,
        pageIndex: 1,
      })
      emptyTableSelect()
    },
    // 延时进行搜索
    delayRefresh: async (ms: number) => {
      await delay(500)
      setPageInfo({
        ...pageInfo,
        pageIndex: 1,
      })
      cancel()
      run(url, {
        ...searchParams,
        ...pageInfo,
        pageIndex: 1,
      })
      emptyTableSelect()
    },
    urlChange: (requestUrl: string, params: object) => {
      setPageInfo({
        ...pageInfo,
        pageIndex: 1,
      })
      cancel()
      run(requestUrl, {
        ...params,
        ...pageInfo,
        pageIndex: 1,
      })
      emptyTableSelect()
    },
  }))

  const emptyTableSelect = () => {
    if (tableRef.current) {
      tableRef.current.emptySelectEvent()
    }
  }

  const selectAll = () => {
    if (tableRef.current) {
      tableRef.current.selectAll()
    }
  }

  const selectAllCheckboxOnChange = (checkedValue: boolean) => {
    if (checkedValue) {
      selectAll()
    } else {
      emptyTableSelect()
    }
  }

  return (
    <div className={styles.engineerTable}>
      {loading && (
        <div className={styles.loadingContent}>
          <Spin spinning={loading} tip="数据请求加载中..." />
        </div>
      )}
      <div className={styles.engineerTableContent}>
        {tableShowDataSource && tableShowDataSource.length === 0 && (
          <div className={styles.emptyTableContent}>
            <EmptyTip
              description={
                currentClickTabType === 'agent' && userType === 3
                  ? '公司管理员无需使用该功能'
                  : '没有找到匹配的记录'
              }
            />
          </div>
        )}
        {tableShowDataSource && tableShowDataSource.length > 0 && (
          <VirtualTable
            style={{ color: '#8C8C8C', borderColor: '#DBDBDB' }}
            className="border"
            data={tableShowDataSource}
            ref={tableRef}
            columns={columns}
            headerRows={({ _header }) => _header === true}
            customRow={{
              custom: ({ _parent }) => _parent === true,
              row: (props) => (
                <ParentRow
                  data={tableShowDataSource}
                  cache={cache}
                  update={(data) => setTableShowDataSource(data)}
                  columns={parentColumns}
                  {...props}
                />
              ),
            }}
            rowHeight={ROW_HEIGHT}
            rowSelection={{
              defaultSelectedKeys: [],
              rowKey: ({ id }) => id,
              onChange: (keys) => {
                getSelectRowKeys?.(keys)
              },
              onSelectRowsChange: (rows) => {
                getSelectRowData?.(rows)
              },
              getSelectIndeterminate: (value) => {
                setIndeterminate(value)
              },
              getCheckAllType: (value) => {
                setAllCheckValue(value)
              },
            }}
          />
        )}
      </div>

      <div className={styles.engineerTablePagingContent}>
        <div className={styles.engineerTablePagingSelect}>
          <Checkbox
            checked={allCheckValue}
            indeterminate={indeterminate}
            onChange={(e) => selectAllCheckboxOnChange(e.target.checked)}
          >
            全选
          </Checkbox>
        </div>
        {(!sideVisible || selectedFavId) && (
          <>
            <div className={styles.engineerTablePagingLeft}>
              <span>显示第</span>
              <span className={styles.importantTip}>{tableResultData.dataStartIndex}</span>
              <span>到第</span>
              <span className={styles.importantTip}>{tableResultData.dataEndIndex}</span>
              <span>条记录，总共</span>
              <span className={styles.importantTip}>{tableResultData.engineerLen}</span>
              <span>个工程，</span>
              <span className={styles.importantTip}>{tableResultData.projectLen}</span>个项目
            </div>
            <div className={styles.engineerTablePagingRight}>
              <Pagination
                pageSize={pageInfo.pageSize}
                onChange={currentPageChangeEvent}
                size="small"
                total={tableResultData.total}
                current={pageInfo.pageIndex}
                // hideOnSinglePage={true}
                showSizeChanger
                showQuickJumper
                onShowSizeChange={currentPageSizeChangeEvent}
                style={{ display: 'inline-flex', paddingRight: '25px' }}
              />
            </div>
            {pagingSlot}
          </>
        )}
      </div>
    </div>
  )
}

export default memo(forwardRef(EngineerTable))
