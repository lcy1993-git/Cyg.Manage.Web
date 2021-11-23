import { Checkbox } from 'antd'
import React, { Key, memo } from 'react'
import { ListChildComponentProps } from 'react-window'
import VTCell from './Cell'
import HeaderRow from './HeaderRow'
import { allocateWidth } from './ParentRow'
import { RowContext } from './VirtualTable'

type RowProps<T> = ListChildComponentProps<RowContext<T>>

const VTRow = memo(
  <T extends Record<string, any>>({
    index: rowIndex,
    style,
    data: {
      data: rawData,
      columns,
      headerRows,
      loadingText,
      rowSelection,
      selectedKeys,
      updateSelectedKeysFlow,
      customRow,
      rowHeight,
      tableHeight,
      tableWidth,
      ...rest
    },
    isScrolling,
  }: RowProps<T>) => {
    const rowData = rawData[rowIndex]

    const rowKey = rowSelection && rowSelection.rowKey ? rowSelection.rowKey(rowData) : rowIndex
    // 滚动条宽度
    const SCROLL_BAR_WIDTH = 19
    // 是否超出容器高度
    const needScroll = rawData.length * rowHeight > tableHeight
    // 可用宽度
    const usefulWidth = tableWidth - (needScroll ? SCROLL_BAR_WIDTH : 0)

    // 分配宽度
    const widthBuckets = allocateWidth(usefulWidth, columns.length)

    const _columns = columns.map((c, index) => ({
      ...c,
      // 分配宽度
      width: widthBuckets[index],
    }))

    const renderParams = {
      ...rest,
      rowData,
      rowIndex,
      tableHeight,
      tableWidth,
      rowHeight,
      originColumns: _columns,
      isScrolling: !!isScrolling,
      selectedRowKeys: selectedKeys,
      selectRows: (...params: [keys: Key[], selected: boolean]) =>
        updateSelectedKeysFlow(...params, rowData, rowData.projects),
    } as const

    /* 表头 */
    if (typeof headerRows === 'function' && headerRows(rowData, rowIndex) === true) {
      return <div style={{ ...style, width: 'max-content' }}>{<HeaderRow {...renderParams} />}</div>
    }

    /* 自定义行 */
    if (
      customRow &&
      typeof customRow.custom === 'function' &&
      typeof customRow.row === 'function' &&
      customRow.custom(rowData, rowIndex) === true
    ) {
      return <div style={{ ...style, width: 'max-content' }}>{customRow.row(renderParams)}</div>
    }

    /* 默认 */
    const { height } = style as { height: number }
    const loading = isScrolling && loadingText

    const prefix = (index: number) => {
      if (index !== 0 || !rowSelection) return null

      return (
        <Checkbox
          className="vt-checkbox"
          checked={selectedKeys.includes(rowKey!)}
          onChange={(e) => updateSelectedKeysFlow([rowKey!], e.target.checked, rowData, [rowData])}
        />
      )
    }
    return (
      <div className="vt-row" style={{ ...style, width: 'max-content' }}>
        {loading
          ? loadingText
          : _columns.map((c, index) => (
              <VTCell
                {...c}
                style={{ height, lineHeight: `${height}px` }}
                prefix={prefix}
                key={index}
                height={height}
                rowData={rowData}
                rowIndex={rowIndex}
                columnIndex={index}
                columns={_columns}
              />
            ))}
      </div>
    )
  }
)

export default VTRow
