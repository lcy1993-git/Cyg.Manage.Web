import React, {
  ComponentType,
  CSSProperties,
  forwardRef,
  Key,
  Ref,
  useImperativeHandle,
} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import VTRow from './Row'
import './style.css'
import useSelection from './useSelection'

export type RowContext<T> = VirtualTableProps<T> &
  Pick<OriginParams<T>, 'maxRowWidth' | 'rowHeight' | 'tableHeight' | 'tableWidth'> & {
    selectedKeys: Key[]
    updateSelectedKeysFlow: (
      keys: Key[],
      selected: boolean,
      rowData: T,
      selectRowsData: T[]
    ) => void
  }

export type ColumnDataIndex<T extends Record<string, any>> =
  | string
  | string[]
  | ((rowData: T, rowIndex?: number, columnIndex?: number) => string)

export type ColumnRender<T extends Record<string, any>> = (
  value?: unknown,
  rowData?: T,
  rowIndex?: number,
  columnIndex?: number,
  rawData?: T[]
) => React.ReactNode

export type Column<T = Record<string, any>> = {
  title?: string
  width: number
  dataIndex?: ColumnDataIndex<T>
  render?: ColumnRender<T>
  fixed?: 'left' | 'right'
  ellipsis?: boolean
}

export type OriginParams<T = Record<string, any>> = {
  rowData: T
  rowIndex: number
  /** 列配置 */
  originColumns: Column<T>[]
  /** y 轴滚动状态 */
  isScrolling: boolean
  /** 表格宽度 */
  tableWidth: number
  /** 表格高度 */
  tableHeight: number
  /** 行高 */
  rowHeight: number
  /** 行最大宽度 */
  maxRowWidth: number
  /** 选择行 */
  selectRows: (keys: Key[], selected: boolean) => void
  /** 已被选的行 key */
  selectedRowKeys: Key[]
}

export type VirtualTableProps<T extends Record<string, any>> = {
  className?: string
  style?: CSSProperties
  data: T[]
  columns: Column[]
  /**
   * 行高，默认 50
   */
  rowHeight?: number
  /**
   * 上下滚动时的占位字符
   */
  loadingText?: string
  /**
   * 选择
   */
  rowSelection?: {
    defaultSelectedKeys?: Key[]
    rowKey?: (rowData: T) => Key
    onChange?: (keys: Key[]) => void
    onSelect?: (key: Key, selected: boolean, rowData: T) => void
    onSelectRowsChange?: (selectRows: T[]) => void
  }
  /**
   * 表头，返回 true 表示该行数据是表头
   */
  headerRows?: (rowData: T, rowIndex: number) => boolean
  /**
   * 自定义行
   */
  customRow?: {
    /**
     * 返回 true，表示该行由 row 函数自定义
     */
    custom: (rowData: T, rowIndex: number) => boolean
    row: (origin: OriginParams<T>) => React.ReactNode
  }
}

export type VirtualTableInstance = {
  /** 刷新 */
  emptySelectEvent: () => void
  /** 全选 */
  selectAll: () => void
}

/**
 * @see https://react-window.vercel.app/#/api/FixedSizeList
 */
const VirtualTable = <T extends Record<string, any>>(
  { data, columns, rowHeight, rowSelection, style, className, ...rest }: VirtualTableProps<T>,
  ref: Ref<VirtualTableInstance>
) => {
  const selection = useSelection({ rowSelection, data })
  const { updateSelectedKeysFlow, emptySelectArray, selectedKeys, selectAll } = selection

  useImperativeHandle(
    ref,
    () => ({
      emptySelectEvent: emptySelectArray,
      selectAll,
    }),
    [emptySelectArray, selectAll]
  )

  return (
    <AutoSizer>
      {({ height: tableHeight, width: tableWidth }) => {
        const itemSize = typeof rowHeight === 'number' ? rowHeight : 50
        const _className = `vt-table${className ? ' ' + className : ''}`
        const itemData = {
          data,
          columns,
          rowHeight: itemSize,
          tableWidth,
          tableHeight,
          maxRowWidth: columns.reduce((s, c) => (s += c.width), 0),
          rowSelection,
          selectedKeys,
          updateSelectedKeysFlow,
          ...rest,
        }

        return (
          <FixedSizeList
            style={style}
            className={_className}
            height={tableHeight}
            itemCount={data.length}
            itemSize={itemSize}
            width={tableWidth}
            itemData={itemData}
            useIsScrolling
          >
            {VTRow as ComponentType<ListChildComponentProps<RowContext<T>>>}
          </FixedSizeList>
        )
      }}
    </AutoSizer>
  )
}

export default forwardRef(VirtualTable)
